"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class WorkTimeSchema extends Schema {
  up() {
    this.create("work_times", (table) => {
      table.increments("working_id").primary();
      table.integer("time_slot").notNullable();
      table.time("start_time").notNullable();
      table.time("end_time").notNullable();
      table
        .enum("day", [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ])
        .nullable();
      table
        .enum("availability", ["AVAILABLE", "UNAVAILABLE"])
        .defaultTo("AVAILABLE");
      table.integer("type_id").notNullable(); // [FK]
      table.integer("doctor_id").nullable(); // [FK]
      table.timestamps();
    });
  }

  down() {
    this.drop("work_times");
  }
}

module.exports = WorkTimeSchema;
