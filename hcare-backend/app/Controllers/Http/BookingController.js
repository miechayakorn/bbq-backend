"use strict";
const Type = use("App/Models/Type");
const Booking = use("App/Models/Booking");
const User = use("App/Models/User");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");

class BookingController {
  async showType({ request, response }) {
    try {
      let types = await Type.all(); // fatch all record from types table
      let typeJSON = types.toJSON(); // parse to json
      const returnType = []; // return to fontend type_id and type_name only
      for (let index = 0; index < typeJSON.length; index++) {
        returnType[index] = {
          type_id: typeJSON[index].type_id,
          type_name: typeJSON[index].type_name
        };
      }
      console.log(returnType);
      return returnType;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }

  async showDate({ request, response, params }) {
    try {
      let allBooking = await Database.table("bookings")
        .select("type_id", "date")
        .distinct("date")
        .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%d") as date'))
        .where({ type_id: params.type_id });
      return allBooking;
    } catch (error) {
      return error;
    }
  }

  async showTime({ request, response, params }) {
    let data = request.all("time");
    try {
      let allTime = await Database.table("bookings")
        .select("booking_id", "type_id", "time_in", "status")
        .where({ date: data.time, type_id: params.type_id });
      return allTime;
    } catch (error) {
      return error;
    }
  }

  async submitBooking({ request, response }) {
    try {
      const dataFromBooking = request.only([
        "booking_id",
        "hn_number",
        "symptom"
      ]);
      console.log(dataFromBooking);

      //find account from hn_number
      const userAccount = await Database.select(
        "accounts.hn_number",
        "email",
        "first_name",
        "last_name"
      )
        .from("users")
        .innerJoin("accounts", "users.user_id", "accounts.user_id")
        .where("accounts.hn_number", dataFromBooking.hn_number)
        .first();

      console.log(userAccount);

      // find booking slot from bookingID that get from request to find in DB
      const findBooking = await Database.select(
        "booking_id",
        "type_name",
        "time_in",
        "time_out",
        "date",
        "status"
      )
        .from("bookings")
        .innerJoin("types", "bookings.type_id", "types.type_id")
        .where("bookings.booking_id", dataFromBooking.booking_id)
        .first();

      console.log(findBooking);

      if (userAccount) {
        // check account not null
        console.log("00000000000000000000000000000000000000");

        if (!findBooking.status) {
          // check booking status available
          console.log("1111111111111111111111111111111111111111111111111");
          const token = `${Date.now()}${findBooking.booking_id}`;

          console.log(token);

          const dataForSendEmail = {
            user: userAccount,
            bookingSlot: findBooking,
            token
          };

          console.log(dataForSendEmail);

          console.log(userAccount.email);

          await Mail.send("email", dataForSendEmail, message => {
            message
              .to(userAccount.email)
              .from("demo@demo-adonis.com")
              .subject(
                `Submit Booking From Health Care ${bookingSlot.type_name}`
              );
          });

          console.log(
            "///////////////////////////////////////////////////////////"
          );

          // if (sendMail) {
          //   await Database.table("bookings")
          //     .where("booking_id", dataFromBooking.booking_id)
          //     .update({
          //       hn_number: dataFromBooking.hn_number,
          //       status: "waitting confirm",
          //       comment_from_user: dataFromBooking.symptom
          //     });

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

  async showBookingForHCARE({ request, response, params }) {
    try {
      console.log(params.type + " " + params.date);
      let userBooking2 = await Database.select(
        "accounts.hn_number",
        "first_name",
        "last_name",
        "time_in"
      )
        .from("users")
        .innerJoin("accounts", "users.user_id", "accounts.user_id")
        .innerJoin("bookings", "accounts.hn_number", "bookings.hn_number")
        .where({ type_id: params.type, date: params.date });
      console.log("--------------------------------------------------");
      console.log(userBooking2);
      return userBooking2;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async showBookingForHCAREDefault({ request, response }) {
    try {
      let userBooking = await Database.select(
        "accounts.hn_number",
        "first_name",
        "last_name",
        "time_in"
      )
        .from("users")
        .innerJoin("accounts", "users.user_id", "accounts.user_id")
        .innerJoin("bookings", "accounts.hn_number", "bookings.hn_number");
      console.log("--------------------------------------------------");
      console.log(userBooking);
      return userBooking;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  // async showBookingForUser({ request, response, params }) {
  //   try {
  //     let showbook = await Database.select("*")
  //       .from("bookings")
  //       .where({ booking_agent: params.user_id, status:  });
  //     return showbook;
  //   } catch (error) {
  //     response.status(500).send(error);
  //   }
  // }

  async confirmBooking({ request, response }) {
    const query = request.get();
    if (query.token) {
      const booking = await Booking.query()
        .where("token", query.token)
        .first();
      if (booking) {
        booking.status = "confirm successful";
        booking.token = "";
        await booking.save();

        return response.json({
          message: "booking confirm successful!"
        });
      }
    } else {
      return response.json({
        message: "token not exist"
      });
    }
  }
}

module.exports = BookingController;
