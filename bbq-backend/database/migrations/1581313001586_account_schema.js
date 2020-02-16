'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      
      table.increments('user_id').primary() //  [PK,FK]
      table.string('password', 60).notNullable()
      table.string('hn_number', 20).notNullable().unique() // [UQ,NN]
      table.boolean('verify').defaultTo(false) //[T,F]
      table.string('first_name', 80).notNullable() // [NN]
      table.string('last_name', 80).notNullable() // [NN]
      table.string('priviledge').notNullable() // [NN,CK]
      table.string('email', 254).notNullable() // [NN,CK]
      table.string('telephone', 15).notNullable() // [NN]

      // table.integer('')
      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema
