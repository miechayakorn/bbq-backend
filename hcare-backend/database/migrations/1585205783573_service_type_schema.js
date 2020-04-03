'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceTypeSchema extends Schema {
  up () {
    this.create('servicetypes', (table) => {
      table.increments('type_id').primary() //PK
      table.string('type_name').notNullable()
      table.boolean('available').defaultTo(true)   
      table.timestamps()
    })
  }

  down () {
    this.drop('servicetypes')
  }
}

module.exports = ServiceTypeSchema
