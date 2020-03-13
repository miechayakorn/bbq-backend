"use strict";
const Type = use("App/Models/Type");
const Database = use("Database");

class CreateBookingController {
  async create({ request, response }) {
    try {
      const data = await request.only(["type_id"]);
      //console.log(data);
    //   let start_time = await Database.select("start_time")
    //     .from("types")
    //     .where({
    //       type_id: data.type_id
    //     });
    //   let end_time = await Database.select("end_time")
    //     .from("types")
    //     .where({
    //       type_id: data.type_id
    //     });

    //   start_time = start_time[0].start_time;
    //   end_time = end_time[0].end_time;
    //   let hours_start = parseInt(start_time.substring(0,2));
    //   let min_start = parseInt(start_time.substring(3,6));

    //   let hours_end = parseInt(end_time.substring(0,2));
    //   let min_end = parseInt(end_time.substring(3,5));

    //   const timeForSlot =  ((hours_end-hours_start)*60);
      
    //   console.log(min_start);
    //     const typeFromDB = await Type.find(params.type)
    //     console.log(typeFromDB)

      const type = Database.from('types').where({type_id:data.type_id})
      return type; 

    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
}

module.exports = CreateBookingController;
