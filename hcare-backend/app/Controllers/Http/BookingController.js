"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");
const DateFormat = use("App/Service/DateService");

class BookingController {
  //แสดงประเภทการนัดหมาย
  async showType({ request, response }) {
    try {
      let types = await Database.from("servicetypes").where(
        "availability",
        "AVAILABLE"
      );
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
        .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%e") as datevalue'))
        .select(Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as dateformat'))
        .distinct("date")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({ type_id: params.type_id })
        .groupBy("date")
        .having("date", ">", new Date());

      for (let index = 0; index < allBooking.length; index++) {
        allBooking[index].dateformat = DateFormat.ChangeDateFormat(
          allBooking[index].dateformat
        );
      }

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

  //จองตารางนัดหมาย และส่ง e-mail
  async submitBooking({ request, response, auth }) {
    try {
      const dataFromBooking = request.only(["booking_id", "symptom"]);

      console.log(dataFromBooking);

      const account = await auth.getUser();
      console.log(account);

      if (account.verify == "NOT VERIFY") {
        return response.json({ message: "Please verrify account" });
      }

      // find booking slot from bookingID that get from request to find in DB
      let findBooking = await Database.select(
        "booking_id",
        "type_name",
        "time_in",
        "time_out",
        "date",
        "status"
      )
        .select(Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as date'))
        .from("bookings")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("servicetypes", "work_times.type_id", "servicetypes.type_id")
        .where("bookings.booking_id", dataFromBooking.booking_id)
        .first();

      findBooking.date = DateFormat.ChangeDateFormat(findBooking.date);

      console.log(findBooking);

      if (account) {
        // check account not null

        if (!findBooking.status) {
          // check booking status available

          const tokenNoHash = `${Date.now()}${
            findBooking.booking_id
          }${Date.now()}`;
          const token = await Hash.make(tokenNoHash);

          const dataForSendEmail = {
            account: account,
            bookingSlot: findBooking,
            token,
            url: Env.get("VUE_APP_FONTEND_URL"),
          };

          console.log(dataForSendEmail);

          const subject =
            "Submit Booking From Health Care  " +
            dataForSendEmail.bookingSlot.type_name.toString();

          await Mail.send("confirmbooking", dataForSendEmail, (message) => {
            message
              .to(account.email)
              .from("Mail from healthcare")
              .subject(subject);
          });

          await Booking.query()
            .where("booking_id", dataFromBooking.booking_id)
            .update({
              account_id_from_user: dataForSendEmail.account.account_id,
              status: "WAITING CONFIRM",
              comment_from_user: dataFromBooking.symptom,
              token_booking_confirm: token,
            });
          return "send mail success";
        }
        return response.status(400).send("This booking unavailable");
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  //ยินยันการนัดหมายหลังจากผู้ใช้กดยืนยันจาก e-mail
  async confirmBooking({ request, response, auth }) {
    const query = request.get();
    try {
      if (query.token) {
        const booking = await Booking.findBy(
          "token_booking_confirm",
          query.token
        );

        if (booking) {
          await Booking.query().where("booking_id", booking.booking_id).update({
            status: "CONFIRM SUCCESS",
            token_booking_confirm: null,
          });

          const bookingNew = await Booking.find(booking.booking_id);

          return response.json({
            message: "Booking confirmation successful",
            booking: bookingNew,
          });
        } else {
          return response.status(304).json({
            message: "This token is not available",
          });
        }
      } else {
        return response.status(500).send("Token not exist");
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  //ยังไม่ได้ใช้งาน
  /*async showBookingForHCAREDefault({ request, response }) {
    try {
      let userBooking = await Database.select(
        "hn_number",
        "first_name",
        "last_name",
        "time_in",
        "working_id"
      )
        .from("bookings")
        .innerJoin(
          "accounts",
          "bookings.account_id_from_user",
          "accounts.account_id"
        )
        .where({ status: "confirm successful", working_id: 1 });
      console.log("00000000000000000000000000000000000000000");
      console.log(userBooking);
      return userBooking;
    } catch (error) {
      return response.status(500).send(error);
    }
  }*/

  //ไม่ได้ใช้งาน
  /* async patientBooking({ request, response, params }) {
    try {
      let booking = await Booking.find(params.booking_id);
      if (booking) {
        response.json({
          booking,
        });
      } else {
        response.status(204).send("Have no booking");
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }*/
}

module.exports = BookingController;
