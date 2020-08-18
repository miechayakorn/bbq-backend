"use strict";
const Database = use("Database");
const Env = use("Env");
const DateService = use("App/Service/DateService");
const CreateSlotRules = use("App/Validators/CreateSlotBooking");
const { validateAll } = use("Validator");

class ManagebookingController {
  //รับ type และวันที่หาช่วงเวลาทำงานเพื่อนำไปเพิ่ม slot
  async CheckTimeslot({ request, response }) {
    try {
      const { type_id, date } = request.only(["type_id", "date"]);
      let dateNewFormat = new Date(date);
      let day = DateService.dateToDay(dateNewFormat.getDay());

      let slot = await Database.table("work_times")
        .select("*")
        .where({ type_id: type_id, day: day })
        .first();

      const minsToAdd = slot.time_slot;
      const start_time = slot.start_time;
      const end_time = slot.end_time;
      //console.log(slot);
      let time_count = start_time;
      let start = new Date(new Date(`1970/01/01"  ${start_time}`)).getTime();
      let end = new Date(new Date(`1970/01/01"  ${end_time}`)).getTime();
      let round = (end - start) / 60000 / minsToAdd;
      console.log("start " + start);
      console.log("end " + end);
      console.log("round " + round);

      let timeArray = [];

      for (let i = 0; i < round; i++) {
        timeArray.push(time_count);
        time_count = new Date(
          new Date("1970/01/01 " + time_count).getTime() + minsToAdd * 60000
        ).toLocaleTimeString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }
      console.log(timeArray);
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
      //console.log(account);
      if (account.role == STAFF || account.role == ADMIN) {
        const { type_id, date, time_slot } = await request.only([
          type_id,
          date,
          time_slot,
        ]);
        await validateAll({ type_id, date }, CreateSlotRules);
      } else {
        return response.status(403).send("Forbidden");
      }
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
}

module.exports = ManagebookingController;
