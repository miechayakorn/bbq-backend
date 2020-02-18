'use strict'

/*
|--------------------------------------------------------------------------
| DaySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Day = use('App/models/Day')
const days = ['MON','TUE','WED','THU','FRI']


class DaySeeder {
  async run () {
    for (let index = 0 ; index < days.length; index++) {
      const dayOfMonth = new Day()
      dayOfMonth.day = days[index]
      await dayOfMonth.save()
    }
  }
}

module.exports = DaySeeder
