'use strict'

/*
|--------------------------------------------------------------------------
| TypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Type = use('App/Models/Type')


class TypeSeeder {
  async run () {
    const typeHC = new Type()
    typeHC.type_name = "จิตแพทย์"
    typeHC.time_slot = 15
    typeHC.start_time = "08:00:00"
    typeHC.end_time = "12:00:00"

    await typeHC.save()
  }
}

module.exports = TypeSeeder
