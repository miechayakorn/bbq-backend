'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeSchema extends Schema {
  up () {
    this.create('types', (table) => {
      table.string('type_id', 10).primary() //PK
      table.string('type_name', 40)
      table.integer('time_slot').notNullable()
      table.string('start_time', 25).notNullable()
      table.string('end_time', 25).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('types')
  }
}

module.exports = TypeSchema
