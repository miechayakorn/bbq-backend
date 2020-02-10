'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CongenitalDisorderSchema extends Schema {
  up () {
    this.create('congenital_disorders', (table) => {
      table.string('id', 10).primary() //PK
      table.text('symtoms', 255)
      table.string('user_id', 10) //FK
      table.timestamps()
    })
  }

  down () {
    this.drop('congenital_disorders')
  }
}

module.exports = CongenitalDisorderSchema
