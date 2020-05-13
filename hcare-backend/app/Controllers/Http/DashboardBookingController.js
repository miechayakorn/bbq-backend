"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");
const DateFormat = use("App/Service/DateService");

class DashboardBookingController {
  //แสดงตารางนัดหมายตามประเภทและเวลาที่ระบุ
  async showBookingForHCARE({ request, response, params, auth }) {
    try {
      const accountHC = await auth.getUser();
      if (accountHC.role == "STAFF" || accountHC.role == "ADMIN") {
        let userBooking = await Database.select(
          "booking_id",
          "account_id",
          "hn_number AS HNnumber ",
          "first_name AS ชื่อ",
          "last_name AS นามสกุล",
          "time_in AS เวลานัด",
          "type_id",
          "date",
          "email",
          "telephone",
          "comment_from_user as symptom",
          "link_meeting",
          "comment_from_staff"
        )
          .select(Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as date'))
          .from("bookings")
          .innerJoin(
            "accounts",
            "bookings.account_id_from_user",
            "accounts.account_id"
          )
          .innerJoin(
            "work_times",
            "bookings.working_id",
            "work_times.working_id"
          )
          .where({
            status: "CONFIRM SUCCESS",
            type_id: params.type,
            date: params.date,
          });

        for (let index = 0; index < userBooking.length; index++) {
          userBooking[index].date = await DateFormat.ChangeDateFormat(
            userBooking[index].date
          );
        }
        return userBooking;
      }
      return response.status(403).send();
    } catch (error) {
      console.log(`Error: ${error}`);
      return response.status(500).send(error);
    }
  }

  /*เพิ่ม link และ note สำหรับ Health care*/
  async editPatientBooking({ request, response, auth }) {
    try {
      const accountHC = await auth.getUser();
      if (accountHC.role == "STAFF" || accountHC.role == "ADMIN") {
        const dataEditPatientBook = request.all(["booking_id", "link", "note"]);
        console.log(dataEditPatientBook);

        const booking = await Booking.find(dataEditPatientBook.booking_id);
        if (booking) {
          if (dataEditPatientBook.link && dataEditPatientBook.note) {
            await Booking.query()
              .where("booking_id", booking.booking_id)
              .update({
                link_meeting: dataEditPatientBook.link,
                comment_from_staff: dataEditPatientBook.note,
              });
          } else if (dataEditPatientBook.note) {
            await Booking.query()
              .where("booking_id", booking.booking_id)
              .update({
                comment_from_staff: dataEditPatientBook.note,
              });
          } else if (dataEditPatientBook.link) {
            await Booking.query()
              .where("booking_id", booking.booking_id)
              .update({
                link_meeting: dataEditPatientBook.link,
              });
          }
          let returnBooking = await Booking.find(booking.booking_id);
          return response.json({
            message: "booking update successful!",
            booking: returnBooking,
          });
        } else {
          return "Have no this booking";
        }
      }
      return response.status(403).send();
    } catch (error) {
      response.status(500).send(error);
    }
  }

  // หน้า Dashboard เมิ่อกดที่ผู้ป่วยจะแสดงข้อมูล //ไม่ได้ใช้
  /*async patientDetail({ request, response, params }) {
    try {
      console.log(params);
      const patientDetail = await Database.select(
        "booking_id",
        "account_id",
        "hn_number",
        "first_name",
        "last_name",
        "email",
        "telephone",
        "comment_from_user"
      )
        .from("bookings")
        .innerJoin(
          "accounts",
          "bookings.account_id_from_user",
          "accounts.account_id"
        )
        .where({ booking_id: params.booking_id })
        .first();
      console.log(patientDetail);
      if (patientDetail) {
        return patientDetail;
      } else {
        response.status(204).send();
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }*/

  //ยกเลิกการจองนัดของผู้ป่วยผ่านหน้า Dashboard
  async cancelAppointment({ request, response, auth }) {
    try {
      const accountHC = await auth.getUser();
      if (accountHC.role == "STAFF" || accountHC.role == "ADMIN") {
        const dataCancel = await request.only(["booking_id"]);
        console.log(dataCancel.booking_id);
        if (dataCancel.booking_id) {
          const booking = await Booking.find(dataCancel.booking_id);
          console.log(booking.status);
          if (booking.status != null) {
            await Booking.query()
              .where("booking_id", dataCancel.booking_id)
              .update({
                status: null,
                comment_from_user: null,
                comment_from_staff: null,
                token_booking_confirm: null,
                link_meeting: null,
                account_id_from_user: null,
                account_id_from_staff: null,
              });
            const bookingUpdate = await Database.from("bookings").where(
              "booking_id",
              booking.booking_id
            );
            return response.json({
              message: "clear schedule successful",
              booking: bookingUpdate,
            });
          } else {
            return response
              .status(304)
              .json({ message: "Don't have booking in database" });
          }
        } else {
          return response
            .status(500)
            .json({ message: "Booking ID does not exist" });
        }
      }
      return response.status(403).send();
    } catch (error) {
      response.status(500).send(error);
    }
  }

  //จองตารางนัดหมายโดย Healthcare
  async submitBookingFromHealthcare({ request, response, auth }) {
    try {
      const accountHC = await auth.getUser();
      if (accountHC.role == "STAFF" || accountHC.role == "ADMIN") {
        const {
          booking_id,
          hn_number,
          symptom,
          accountid_doctor,
        } = request.only([
          "booking_id",
          "hn_number",
          "symptom",
          "accountid_doctor",
        ]);

        //find account from hn_number
        const userAccount = await Database.select(
          "account_id",
          "email",
          "first_name",
          "last_name"
        )
          .from("accounts")
          .where("hn_number", hn_number)
          .first();

        // find booking slot from bookingID that get from request to find in DB
        const findBooking = await Database.select(
          "booking_id",
          "type_name",
          "time_in",
          "time_out",
          "date",
          "status"
        )
          .select(Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as date'))
          .from("bookings")
          .innerJoin(
            "work_times",
            "bookings.working_id",
            "work_times.working_id"
          )
          .innerJoin(
            "servicetypes",
            "work_times.type_id",
            "servicetypes.type_id"
          )
          .where("bookings.booking_id", booking_id)
          .first();

        findBooking.date = DateFormat.ChangeDateFormat(findBooking.date);
        console.log(findBooking);

        if (userAccount) {
          // check account not null

          if (!findBooking.status) {
            // check booking status available

            const dataForSendEmail = {
              account: userAccount,
              bookingSlot: findBooking,
              url: Env.get("VUE_APP_FONTEND_URL"),
            };

            console.log(dataForSendEmail);

            const subject =
              "Boooking By Health Care  " +
              dataForSendEmail.bookingSlot.type_name.toString();

            await Mail.send("sendmailbooking", dataForSendEmail, (message) => {
              message
                .to(userAccount.email)
                .from("Mail from healthcare")
                .subject(subject);
            });

            await Database.table("bookings")
              .where("booking_id", booking_id)
              .update({
                account_id_from_user: dataForSendEmail.account.account_id,
                status: "CONFIRM SUCCESS",
                comment_from_user: symptom,
                account_id_from_staff: accountid_doctor,
              });

            return "send mail success";
          }
          return response.status(400).send("This booking unavailable");
        }
      }
      return response.status(403).send();
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

module.exports = DashboardBookingController;
