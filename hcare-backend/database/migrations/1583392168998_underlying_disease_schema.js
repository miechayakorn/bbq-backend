'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UnderlyingDiseaseSchema extends Schema {
  up () {
    this.create('underlying_diseases', (table) => {
      table.increments('ud_id').primary() //PK
      table.text('symtoms')
      table.integer('user_id') //FK
    })
  }

  down () {
    this.drop('underlying_diseases')
  }
}

module.exports = UnderlyingDiseaseSchema
