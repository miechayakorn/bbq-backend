'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments('user_id').primary() //  [PK,FK]
      table.string('gender', 10).notNullable() //[CK]
      table.string('date_of_birth', 10).notNullable() //[NN]
      table.string('drug_allergy', 10)
      table.string('congenital_disorder', 10)
      
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
