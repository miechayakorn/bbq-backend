"use strict";
const ServiceType = use("App/Models/ServiceType");
const Database = use("Database");

class CreateTypeController {
  async create({ request, response }) {
    try {
      let data = await request.only(["type_name"]);
      console.log(data);
      const typeCreate = await ServiceType.create({
        type_name: data.type_name,
      });
      console.log(await Database.from("servicetypes"));
      return typeCreate;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
  //   async update({ request, response }) {
  //     let data = await request.only([
  //       "type_id",
  //       "time_slot",
  //       "start_time",
  //       "end_time",
  //       "creator_id"
  //     ]);
  //     let type = Database.from("types").where({ type_id: data.type_id });
  //     console.log(type);
  //     if (type === null) {
  //       return "No have this type in database";
  //     }
  //     let updateType = await Database.table("types")
  //       .where("type_id", data.type_id)
  //       .update({
  //         time_slot: data.time_slot,
  //         start_time: data.start_time,
  //         end_time: data.end_time,
  //         creator_id: data.creator_id
  //       });
  //     return await Database.from("types").where({ type_id: data.type_id });
  //   }
}

module.exports = CreateTypeController;
