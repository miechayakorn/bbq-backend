'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.create('bookings', (table) => {
      table.string('booking_id', 100).primary() // PK
      //table.integer('time_in', 15)
      //table.string('time_out', 15)
      table.time('time_in')
      table.time('time_out')
      table.date('date')
      table.boolean('status').defaultTo(false) // [Boolean] // CK
      table.integer('type_id') // [FK]
     
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingSchema
