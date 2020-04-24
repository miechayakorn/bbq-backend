'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NoteForBookingSchema extends Schema {
  up () {
    this.create('note_for_bookings', (table) => {
      
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('note_for_bookings')
  }
}

module.exports = NoteForBookingSchema
