'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments('user_id').primary() //  [PK,FK]
      table.string('gender', 10).nullable() //[CK]
      table.string('date_of_birth', 10).nullable() //[NN]
      table.string('first_name', 80).notNullable() // [NN]
      table.string('last_name', 80).notNullable() // [NN]
      table.integer('account_id').unique() // [FK.UQ]

      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
