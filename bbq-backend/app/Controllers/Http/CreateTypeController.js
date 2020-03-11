"use strict";
const Type = use("App/Models/Type");
const Database = use("Database");

class CreateTypeController {
  async create({ request, response }) {
    try {
      const data = await request.only([
        "type_name",
        "time_slot",
        "start_time",
        "end_time"
      ]);
      console.log(data);
      const type = await Type.create(data);
      return type;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
  async update({ request, response }) {
    const data = await request.only([
      "type_id",
      "time_slot",
      "start_time",
      "end_time",
      "creator_id"
    ]);
    console.log(data);
    const updateType = await Database.table("types")
      .where("type_id", data.type_id)
      .update({
        time_slot: data.time_slot,
        start_time: data.start_time,
        end_time: data.end_time,
        creator_id: data.creator_id
      });
  }
}

module.exports = CreateTypeController;
