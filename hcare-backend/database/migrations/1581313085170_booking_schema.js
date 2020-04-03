"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BookingSchema extends Schema {
  up() {
    this.create("bookings", table => {
      table.increments("booking_id").primary(); // PK
      table.time("time_in");
      table.time("time_out");
      table.date("date");
      table.string("status").nullable(); // 3 status (null , waitting confirm , confirm successful)
      table.text("comment_from_user");
      table.text("comment_from_staff");
      table.boolean("check_attention").defaultTo(false);
      table.string("token_booking_confirm").nullable();
      table.index("token_booking_confirm", "token_booking_confirm");
      table.boolean("available").default(true);
      table.text("link_meeting").nullable();
      table.integer("account_id_from_staff"); // [FK]
      table.integer("account_id_from_user"); // [FK]
      table.integer("working_id"); // [FK]
      table.timestamps();
    });
  }

  down() {
    this.drop("bookings");
  }
}

module.exports = BookingSchema;
