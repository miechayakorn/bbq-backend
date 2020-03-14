"use strict";
const Type = use("App/Models/Type");
const Booking = use("App/Models/Booking");
const User = use("App/Models/User");
const Database = use("Database");

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
      const data = request.only(["booking_id", "user_id"]);
      console.log(data);
      console.log("--------------------------------------------------");
      const user = await User.find(data.user_id);
      console.log(user.toJSON());
      console.log("--------------------------------------------------");
      const booking = await Booking.find(data.booking_id);
      const bookingJSON = booking.toJSON();
      console.log(bookingJSON);
      if (user) {
        if (bookingJSON.status == 0) {
          await Database.table("bookings")
            .where("booking_id", data.booking_id)
            .update({ booking_agent: user.user_id, status: true });
          let bookingSuccess = await Booking.find(data.booking_id);
          return bookingSuccess;
        }

        return response.status(400).send("This booking unavailable");
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async showBookingForHCARE({ request, response, params }) {
    try {
      let showbook = await Database.select("*")
        .from("bookings")
        .where({ type_id: params.type, status: 1 });
      return showbook;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async showBookingForUser({ request, response, params }) {
    try {
      let showbook = await Database.select("*")
        .from("bookings")
        .where({ booking_agent: params.user_id, status: 1 });
      return showbook;
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

module.exports = BookingController;
