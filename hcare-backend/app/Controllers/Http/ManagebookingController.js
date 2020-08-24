"use strict";
const Database = use("Database");
const Env = use("Env");
const DateService = use("App/Service/DateService");
const CreateSlotRules = use("App/Validators/CreateSlotBooking");
const { validateAll } = use("Validator");
const Booking = use("App/Models/Booking");

class ManagebookingController {
  //รับ type และวันที่หาช่วงเวลาทำงานเพื่อนำไปเพิ่ม slot
  async CheckTimeslot({ request, response }) {
    try {
      const { type_id, date } = request.only(["type_id", "date"]);
      let dateNewFormat = new Date(date);
      let day = DateService.dateToDay(dateNewFormat.getDay());

      const slot = await Database.table("work_times")
        .select("*")
        .where({ type_id: type_id, day: day })
        .first();

      //return 204 ในกรณี type_id และ date ไม่มีใน work_times
      if (slot == undefined) {
        return response.status(204).send();
      }

      const minsToAdd = slot.time_slot;
      const start_time = slot.start_time;
      const end_time = slot.end_time;

      let time_count = start_time;
      let start = new Date(new Date(`1970/01/01"  ${start_time}`)).getTime();
      let end = new Date(new Date(`1970/01/01"  ${end_time}`)).getTime();
      let round = (end - start) / 60000 / minsToAdd;

      const con = `${type_id}${date.slice(0, 10).replace(/-/g, "")}%`; //key = type_id + date + time_in
      const timeslot_db = await Database.from("bookings")
        .where("key_slot", "LIKE", con)
        .orderBy("time_in", "date");

      // console.log(timeslot_db);
      // process.exit();
      const timeslot = timeslot_db.map(function (timeslot_db) {
        return timeslot_db.time_in;
      });

      let timeArray = [];

      for (let i = 0; i < round; i++) {
        timeArray.push({
          slot: time_count,
          status:
            timeslot.indexOf(time_count) == -1 ? "available" : "unavailable",
        });
        time_count = new Date(
          new Date("1970/01/01 " + time_count).getTime() + minsToAdd * 60000
        ).toLocaleTimeString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }

      return response.json({
        type_id: type_id,
        date: date,
        timeArray: timeArray,
      });
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }

  // บันทึกการสร้าง slot เวลาใหม่
  async CreateTimeslot({ request, response, auth }) {
    try {
      const account = await auth.getUser();
      if (account.role == "STAFF" || account.role == "ADMIN") {
        const { type_id, date, time_slot } = request.only([
          "type_id",
          "date",
          "time_slot",
        ]);

        await validateAll(
          {
            type_id,
            date,
            time_slot,
          },
          CreateSlotRules
        );
        const dateNewFormat = new Date(date);
        const day_name = DateService.dateToDay(dateNewFormat.getDay());
        const work_times = await Database.table("work_times")
          .select("*")
          .where({
            type_id: type_id,
            day: day_name,
          })
          .first();

        //return 204 ในกรณี type_id และ date ไม่มีใน work_times
        if (work_times == undefined) {
          return response.status(204).send();
        }

        const con = `${type_id}${date.slice(0, 10).replace(/-/g, "")}%`; //key = type_id + date + time_in
        const timeslot_db = await Database.from("bookings")
          .where("key_slot", "LIKE", con)
          .orderBy("time_in", "date");

        //process.exit();
        const timeslot_old = timeslot_db.map(function (timeslot_db) {
          return timeslot_db.key_slot;
        });

        //วนลูป insert
        time_slot.forEach(async (element) => {
          let time_in = element;
          let time_out = new Date(
            new Date("1970/01/01 " + element).getTime() +
              work_times.time_slot * 60000
          ).toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          let add_id = account.account_id;
          let key_slot = `${type_id}${date.split("-").join("")}${element
            .split(":")
            .join("")}`;
          console.log(key_slot);
          try {
            if (!timeslot_old.includes(key_slot))
              await Booking.create({
                time_in: time_in,
                time_out: time_out,
                date: date,
                check_attention: "ABSENT",
                availability: "AVAILABLE",
                working_id: work_times.working_id,
                add_id: add_id,
                key_slot: key_slot,
              });
          } catch (error) {
            response.status(error.status).send();
          }
        });
        response.status(201).send();
      } else {
        return response.status(403).send("Forbidden");
      }
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
}

module.exports = ManagebookingController;
