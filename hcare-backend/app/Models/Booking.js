"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = require("moment");

class Booking extends Model {
  static get primaryKey() {
    return "booking_id";
  }
  static formatDates(field, value) {
    if (field === "date") {
      return value.format("YYYY-MM-DD");
    }
    return super.formatDates(field, value);
  }
}

module.exports = Booking;
