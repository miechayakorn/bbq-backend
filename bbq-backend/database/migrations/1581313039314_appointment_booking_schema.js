'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentBookingSchema extends Schema {
  up () {
    this.create('appointment_bookings', (table) => {
      table.string('appointment_id', 100).primary() //[PK]
      table.string('patient_id', 10)  //[FK]
      table.string('docter_id', 10) //[FK]
      table.string('symptoms', 255)
      table.text('feedback_from_doctor')
      table.boolean('check').defaultTo(false) // [Boolean]
      table.string('booking_id', 100).notNullable() // [FK]

      table.timestamps()
    })
  }

  down () {
    this.drop('appointment_bookings')
  }
}

module.exports = AppointmentBookingSchema
