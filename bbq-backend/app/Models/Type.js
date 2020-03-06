"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Type extends Model {
  Booking() {
    return this.hasMany("App/Models/Booking");
  }
}

module.exports = Type;
