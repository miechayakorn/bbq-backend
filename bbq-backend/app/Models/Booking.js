"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Booking extends Model {
  AppointmentBooking() {
    return this.hasOne("App/Models/AppointmentBooking");
  }
}

module.exports = Booking;
