"use strict";
const Type = use("App/Models/Type");
const Booking = use("App/Models/Booking");
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
  //array : [{type_id:1,date:2020-03-20},{type_id:1,date:2020-03-20,{type_id:1,date:2020-03-20},{type_id:1,date:2020-03-20}}]

  async showDate({ request, response, params }) {
    let allBooking = await Database.table("bookings")
      .select("date")
      .distinct("date")
      .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%d") as date'))
      .where({ type_id: params.type_id });

    return allBooking;

    /*// let allBooking = await Booking.findBy("type_id", params.type_id);
    // let allBookingJSON = allBooking.toJSON();
    let allBooking = await Database.table("bookings")
      .select("booking_id", "date")
      .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%d") as date'))
      .where({ type_id: params.type_id });
    let sendBooking = [];
    for (let i = 0; i < allBooking.length; i++) {
      if(sendBooking.length == 0){
          sendBooking [i] = {
              booking_id: allBooking[i].booking_id,
              date: allBooking[i].date
          }
      }
      for (let j = 0; j < allBooking.length; j++) {
        if (sendBooking[i].date!== allBooking[j].date) {
          sendBooking[i] = {
            booking_id: allBooking[j].booking_id,
            date: allBooking[j].date
          };
        }
      }
    }
    return sendBooking;*/
  }

  async showTime({ request, response, params }) {
    const data = request.all("time");
    try {
      let allTime = await Database.table("bookings")
        .select("time_in")
        .where({ date: data.time, type_id: params.type_id });
      return allTime;
      
    } catch (error) {
      return error;
    }
  }
}

module.exports = BookingController;
