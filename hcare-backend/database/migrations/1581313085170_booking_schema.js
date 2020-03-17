'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.create('bookings', (table) => {
      table.increments('booking_id').primary() // PK
      table.time('time_in')
      table.time('time_out')
      table.date('date')
      table.boolean('status').defaultTo(false) // [Boolean] // CK
      table.text('comment_from_user')
      table.text('comment_from_staff')
      table.boolean('check').defaultTo(false)
      table.integer('booking_agent') // [FK] refer to user table
      table.integer('type_id') // [FK]
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingSchema
