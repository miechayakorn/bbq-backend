"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");
const DateFormat = use("App/Service/DateService");

class AppointmentController {
  /*show appointment for patient*/
  async myAppointment({ request, response, auth }) {
    try {
      const account = await auth.getUser();
      if (account) {
        let mybooking = await Database.select(
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
          .select(
            Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as dateformat')
          )
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
          .innerJoin(
            "servicetypes",
            "work_times.type_id",
            "servicetypes.type_id"
          )
          .where({
            account_id_from_user: account.account_id,
            status: "CONFIRM SUCCESS",
          })
          .orderBy("date", "time");

        for (let index = 0; index < mybooking.length; index++) {
          mybooking[index].dateformat = DateFormat.ChangeDateFormat(
            mybooking[index].dateformat
          );
        }

        console.log(mybooking);

        if (!mybooking[0]) {
          response.status(204).send();
        }

        return mybooking;
      } else {
        response.status(401).send();
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }

  //หน้า appointment detail เมื่อคลิกที่ card
  async myAppointmentDetail({ request, response, params, auth }) {
    try {
      const account = await auth.getUser();

      if (account) {
        //find doctor in account table
        const doctor = await Database.select(
          "account_id AS doctor_id",
          "first_name AS doctor_firstname",
          "last_name AS doctor_lastname"
        )
          .from("bookings")
          .innerJoin(
            "work_times",
            "bookings.working_id",
            "work_times.working_id"
          )
          .innerJoin("accounts", "work_times.doctor_id", "accounts.account_id")
          .where({ booking_id: params.booking_id, role: "STAFF" })
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
          .select(
            Database.raw('DATE_FORMAT(date, "%W %e %M %Y") as dateformat')
          )
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
          .innerJoin(
            "servicetypes",
            "work_times.type_id",
            "servicetypes.type_id"
          )
          .where({
            booking_id: params.booking_id,
            status: "CONFIRM SUCCESS",
          })
          .first();

        booking.dateformat = DateFormat.ChangeDateFormat(booking.dateformat);

        const sendBooking = { ...booking, ...doctor };

        console.log(sendBooking);

        return sendBooking;
      } else {
        return response.status(401).send();
      }

      return sendBooking;
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async cancelAppointmentFromAppointmentDetail({ request, response, auth }) {
    try {
      const { booking_id } = await request.only(["booking_id"]);
      if (booking_id) {
        const booking = await Booking.find(booking_id);
        const account = await auth.getUser();

        if (booking.status == "confirm successful") {
          await Booking.query()
            .where({
              booking_id: booking_id,
              account_id_from_user: account.account_id,
            })
            .update({
              status: null,
              comment_from_user: null,
              comment_from_staff: null,
              token_booking_confirm: null,
              link_meeting: null,
              account_id_from_user: null,
              account_id_from_staff: null,
            });

          const bookingUpdate = await Booking.find(booking_id);

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
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

module.exports = AppointmentController;
