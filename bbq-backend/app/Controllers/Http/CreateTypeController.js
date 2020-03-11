"use strict";
const Type = use("App/Models/Type");

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
  async update({ request, response }) {}
}

module.exports = CreateTypeController;
