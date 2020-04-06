"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");

class BookingController {
  //แสดงประเภทการนัดหมาย
  async showType({ request, response }) {
    try {
      console.log("------------------------------------------------------");
      // let types = await ServiceType.all(); // fatch all record from types table
      // console.log(types);
      // let typeJSON = types.toJSON(); // parse to json
      let types = await Database.from("servicetypes");
      const returnType = []; // return to fontend type_id and type_name only
      for (let index = 0; index < types.length; index++) {
        returnType[index] = {
          type_id: types[index].type_id,
          type_name: types[index].type_name,
        };
      }
      return returnType;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }

  //แสดงวันที่ที่นัดประเภทที่เลือกมีให้บริการ
  async showDate({ request, response, params }) {
    try {
      let allBooking = await Database.table("bookings")
        .select("type_id", "date")
        .distinct("date")
        .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%d") as date'))
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({ type_id: params.type_id });
      return allBooking;
    } catch (error) {
      return error;
    }
  }

  //แสดงช่วงเวลาที่นัดประเภทที่เลือกและวันที่เลือกมีให้บริการ
  async showTime({ request, response, params }) {
    let data = request.all("time");
    try {
      let allTime = await Database.table("bookings")
        .select("booking_id", "type_id", "time_in", "status")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({ date: data.time, type_id: params.type_id });
      return allTime;
    } catch (error) {
      return error;
    }
  }

  //จองตารางนัดหมาย
  async submitBooking({ request, response }) {
    try {
      const dataFromBooking = request.only([
        "booking_id",
        "account_id",
        "symptom",
      ]);
      console.log(dataFromBooking);

      //find account from hn_number
      const userAccount = await Database.select(
        "account_id",
        "email",
        "first_name",
        "last_name"
      )
        .from("accounts")
        .where("account_id", dataFromBooking.account_id)
        .first();

      console.log("************************");

      // find booking slot from bookingID that get from request to find in DB
      const findBooking = await Database.select(
        "booking_id",
        "type_name",
        "time_in",
        "time_out",
        "date",
        "status"
      )
        .select(Database.raw('DATE_FORMAT(date, "%d-%m-%Y") as date'))
        .from("bookings")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("servicetypes", "work_times.type_id", "servicetypes.type_id")
        .where("bookings.booking_id", dataFromBooking.booking_id)
        .first();

      console.log(findBooking);

      if (userAccount) {
        // check account not null
        console.log("+++++++++++++++++++++++++++++");
        if (!findBooking.status) {
          // check booking status available

          const tokenNoHash = `${Date.now()}${
            findBooking.booking_id
          }${Date.now()}`;
          const token = await Hash.make(tokenNoHash);

          console.log(token);

          const dataForSendEmail = {
            account: userAccount,
            bookingSlot: findBooking,
            token,
            url: Env.get("VUE_APP_BACKEND_URL"),
          };

          console.log(dataForSendEmail);

          const subject =
            "Submit Booking From Health Care  " +
            dataForSendEmail.bookingSlot.type_name.toString();

          await Mail.send("confirmbooking", dataForSendEmail, (message) => {
            message
              .to(userAccount.email)
              .from("Mail from healthcare")
              .subject(subject);
          });

          console.log(
            "000000000000000000000000000000000000000000000000000000000"
          );

          await Database.table("bookings")
            .where("booking_id", dataFromBooking.booking_id)
            .update({
              account_id_from_user: dataForSendEmail.account.account_id,
              status: "waitting confirm",
              comment_from_user: dataFromBooking.symptom,
              token_booking_confirm: token,
            });

          return "send mail success";

          // let bookingSuccess = await Booking.find(dataFromBooking.booking_id);
          // console.log(bookingSuccess);
          // return bookingSuccess;
        }
        return response.status(400).send("This booking unavailable");
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  //ยินยันการนัดหมายหลังจากผู้ใช้กดยืนยันจาก e-mail
  async confirmBooking({ request, response }) {
    const query = request.get();
    try {
      if (query.token) {
        const booking = await Booking.findBy(
          "token_booking_confirm",
          query.token
        );

        console.log("---------------------------------------------");
        console.log(booking);

        if (booking) {
          let updateBooking = await Booking.query()
            .where("booking_id", booking.booking_id)
            .update({
              status: "confirm successful",
              token_booking_confirm: null,
            });

          const bookingNew = await Booking.find(booking.booking_id);

          return response.json({
            message: "booking confirm successful!",
            booking: bookingNew,
          });
        } else {
          return "This booking has been confirmed";
        }
      } else {
        return response.json({
          message: "token not exist",
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }

  //แสดงตารางนัดหมายตามประเภทและเวลาที่ระบุ
  async showBookingForHCARE({ request, response, params }) {
    try {
      console.log(params.type + " " + params.date);
      let userBooking = await Database.select(
        "booking_id",
        "hn_number",
        "first_name",
        "last_name",
        "time_in",
        "type_id",
        "date"
      )
        .select(Database.raw('DATE_FORMAT(date, "%d/%m/%Y") as date'))
        .from("bookings")
        .innerJoin(
          "accounts",
          "bookings.account_id_from_user",
          "accounts.account_id"
        )
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({
          status: "confirm successful",
          type_id: params.type,
          date: params.date,
        });
      console.log("--------------------------------------------------");
      console.log(userBooking);
      console.log(userBooking);
      return userBooking;
      return userBooking2;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  //ยังไม่ได้ใช้งาน
  // async showBookingForHCAREDefault({ request, response }) {
  //   try {
  //     let userBooking = await Database.select(
  //       "hn_number",
  //       "first_name",
  //       "last_name",
  //       "time_in",
  //       "working_id"
  //     )
  //       .from("bookings")
  //       .innerJoin(
  //         "accounts",
  //         "bookings.account_id_from_user",
  //         "accounts.account_id"
  //       )
  //       .where({ status: "confirm successful", working_id: 1 });
  //     console.log("00000000000000000000000000000000000000000");
  //     console.log(userBooking);
  //     return userBooking;
  //   } catch (error) {
  //     return response.status(500).send(error);
  //   }
  // }

  //show appointment for patient
  async myAppointment({ request, response }) {
    try {
      const dataMyAppoint = request.only(["account_id"]);
      console.log(dataMyAppoint);
      const mybooking = await Database.select(
        "account_id",
        "hn_number",
        "first_name",
        "last_name",
        "booking_id",
        "work_times.type_id",
        "type_name",
        "date",
        "time_in"
      )
        .from("bookings")
        .innerJoin(
          "accounts",
          "bookings.account_id_from_user",
          "accounts.account_id"
        )
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("servicetypes", "work_times.type_id", "servicetypes.type_id")
        .where({
          account_id_from_user: dataMyAppoint.account_id,
          status: "confirm successful",
        });

      console.log(mybooking);
      return mybooking;
    } catch (error) {
      response.status(500).send(error);
    }
  }

  //
  // async patientBooking({ request, response, params }) {
  //   try {
  //     let booking = await Booking.find(params.booking_id);
  //     if (booking) {
  //       response.json({
  //         booking,
  //       });
  //     } else {
  //       response.status(204).send("Have no booking");
  //     }
  //   } catch (error) {
  //     response.status(500).send(error);
  //   }
  // }

  async editPatientBooking({ request, response }) {
    try {
      const dataEditPatientBook = request.all(["booking_id", "link", "note"]);
      console.log(dataEditPatientBook);

      const booking = await Booking.find(dataEditPatientBook.booking_id);
      if (booking) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        await Booking.query().where("booking_id", booking.booking_id).update({
          link_meeting: dataEditPatientBook.link,
          comment_from_staff: dataEditPatientBook.note,
        });
        let returnBooking = await Booking.find(booking.booking_id);
        return response.json({
          message: "booking update successful!",
          booking: returnBooking,
        });
      } else {
        return "Have no this booking";
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async myAppointmentDetail({ request, response, params }) {
    try {
      console.log(params.booking_id);

      const doctor = await Database.select(
        "account_id AS doctor_id",
        "first_name AS doctor_firstname",
        "last_name AS doctor_lastname"
      )
        .from("bookings")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("accounts", "work_times.doctor_id", "accounts.account_id")
        .where({ booking_id: params.booking_id, role: "doctor" }).first();

      const booking = await Database.select(
        "account_id",
        "hn_number",
        "first_name",
        "last_name",
        "booking_id",
        "work_times.type_id",
        "type_name",
        "date",
        "time_in",
        "link_meeting"
      )
        .from("bookings")
        .innerJoin(
          "accounts",
          "bookings.account_id_from_user",
          "accounts.account_id"
        )
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("servicetypes", "work_times.type_id", "servicetypes.type_id")
        .where({
          booking_id: params.booking_id,
          status: "confirm successful",
        }).first();

      // const sendBooking = {
      //   account_id: booking.account_id,
      //   hn_number: booking.hn_number,
      //   first_name: booking.first_name,
      //   last_name: booking.last_name,
      //   booking_id: booking.booking_id,
      //   working_id: booking.working_id,
      //   work_times: booking.work_times,
      //   type_name: booking.type_name,
      //   date: booking.date,
      //   time: booking.time,
      //   link_meeting: booking.link_meeting,
      //   doctor_id: doctor.account_id,
      //   doctor_fitstname: doctor.first_name,
      //   doctor_lastname: doctor.last_name,
      // };
      
     
      const sendBooking = {...booking,...doctor}
      
      console.log(sendBooking);

      return sendBooking;
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

module.exports = BookingController;
