"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class WorkTime extends Model {
  // Day() {
  //   return this.belongsToMany("App/Models/Day").pivotTable("work_times");
  // }
  // Type() {
  //   return this.belongsToMany("App/Models/Type").pivotTable("work_times");
  // }
  static get primaryKey() {
    return "working_id";
  }
}

module.exports = WorkTime;
