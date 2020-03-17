'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddcolumninstaffSchema extends Schema {
  up () {
    this.alter("staff", table => {
      table.integer("account_id").unique(); // [FK.UQ]
    });
  }

  down () {
    this.alter("staff", table => {
      table.integer("account_id").unique(); // [FK.UQ]
    });
  }
}

module.exports = AddcolumninstaffSchema
