"use strict";
const Database = use("Database");

class CreateBookingController {
  async checkWorktime({ request, response }) {
    const { type_id, day } = request.only(["type_id", "day"]);
    try {
      day = day.toUpperCase();
      console.log(day);
      const workTime = await Database.select("*")
        .from("work_times")
        .where({ type_id: type_id, day: day });
      if (workTime) {
        return response.json(workTime);
      } else {
        return response.status(204);
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
  async store({ request, response }) {
    // const { date, working_id, time_slot } = await request.only([
    //   "date",
    //   "working_id",
    //   "time_slot",
    // ]);
    // try {
    //   if (date && working_id && time_slot) {
    //     for (let index = 0; index < time_slot.length; index++) {
    //       await Database.insert({})
    //     }
    //   }
    // } catch (error) {
    // }
  }
}

module.exports = CreateBookingController;
