"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = require("moment");

class Booking extends Model {
  static get primaryKey() {
    return "booking_id";
  }
  // static formatDates(field, value) {
  //   if (field === "date") {
  //     return value.format("YYYY-MM-DD");
  //   }
  //   return super.formatDates(field, value);
  // }

  // static formatDates (key, value) {
  //   return moment(value).format("YYYY-MM-DD")
  // }

  // static formatDates(field, value) {
  //   if (field == "date") {
  //     // format only certain fields
  //     return moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
  //   }
  //   return super.formatDates(field, value);
  // }

  static get dates () {
    return super.dates.concat(['date'])
  }

  static formatDates (field, value) {
    if (field === 'date') {
        return value.format('DD-MM-YYYY')
       }
    return super.formatDates(field, value)
  }

}

module.exports = Booking;
