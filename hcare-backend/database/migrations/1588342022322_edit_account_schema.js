"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EditAccountSchema extends Schema {
  up() {
    this.table("accounts", (table) => {
      table.enum("role", ["USER", "STAFF", "ADMIN"]).alter();
      table.string("role_in_healthcare").nullable();
    });
  }

  down() {}
}

module.exports = EditAccountSchema;
