'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DaySchema extends Schema {
  up () {
    this.create('days', (table) => {
      table.string('day_id', 255).primary() //PK
      table.string('day', 10)
      table.boolean('availability')
      table.string('type_id', 10) //FK
      table.timestamps()
    })
  }

  down () {
    this.drop('days')
  }
}

module.exports = DaySchema
