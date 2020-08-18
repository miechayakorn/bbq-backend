"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnInBookingSchema extends Schema {
  up() {
    this.raw("ALTER TABLE bookings ADD add_id int(10)");
    this.raw("ALTER TABLE bookings ADD edit_id int(10)");
  }

  down() {}
}

module.exports = AddColumnInBookingSchema;
