"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StaffHealthcareSchema extends Schema {
  up() {
    this.create("staff_healthcares", (table) => {
      table.increments("sh_id").primary(); //  [PK]
      table.bigInteger("staff_id").notNullable().unique(); // [UQ,NN]
      table.string("password").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique(); // [NN,UQ]
      table.bigInteger("telephone").notNullable(); // [NN]
      table.enum("verify", ["SUCCESS", "NOT VERIFY"]).defaultTo("NOT VERIFY"); //[T,F]
      table.string("role").nullable(); // [NN]
      table.enum("privilege", ["STAFF", "ADMIN"]).nullable();
      table.string("token").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("staff_healthcares");
  }
}

module.exports = StaffHealthcareSchema;
