"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountSchema extends Schema {
  up() {
    this.create("accounts", table => {
      table.increments("account_id").primary(); //  [PK]
      table
        .bigInteger("hn_number")
        .notNullable()
        .unique(); // [UQ,NN]
      table.string("password").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.boolean("verify").defaultTo(false); //[T,F]
      table.string("gender", 10).nullable();
      table.string("date_of_birth", 20).nullable();
      table.string("email", 254).notNullable(); // [NN,CK]
      table.bigInteger("telephone").notNullable(); // [NN]
      table.string("role").notNullable(); // [NN]

      table.timestamps();
    });
  }

  down() {
    this.drop("accounts");
  }
}

module.exports = AccountSchema;
