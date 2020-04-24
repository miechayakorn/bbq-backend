"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");

class AppointmentController {
  /*show appointment for patient*/
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
        "time_in",
        "link_meeting"
      )
        .select(Database.raw('DATE_FORMAT(date, "%W %d %M %Y") as dateformat'))
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
        })
        .orderBy("date", "time");

      console.log(mybooking);

      if (!mybooking[0]) {
        response.status(204).send();
      }

      return mybooking;
    } catch (error) {
      response.status(500).send(error);
    }
  }

  //หน้า appointment detail เมื่อคลิกที่ card
  async myAppointmentDetail({ request, response, params }) {
    try {
      console.log(params.booking_id);

      //find doctor in account table
      const doctor = await Database.select(
        "account_id AS doctor_id",
        "first_name AS doctor_firstname",
        "last_name AS doctor_lastname"
      )
        .from("bookings")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("accounts", "work_times.doctor_id", "accounts.account_id")
        .where({ booking_id: params.booking_id, role: "doctor" })
        .first();

      // find booking and personal data of patient
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
        .select(Database.raw('DATE_FORMAT(date, "%W %d %M %Y") as dateformat'))
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
        })
        .first();

      const sendBooking = { ...booking, ...doctor };

      console.log(sendBooking);

      return sendBooking;
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

module.exports = AppointmentController;
