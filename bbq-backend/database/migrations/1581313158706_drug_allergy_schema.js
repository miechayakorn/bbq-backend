'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DrugAllergySchema extends Schema {
  up () {
    this.create('drug_allergies', (table) => {
      table.string('medicine_id', 10).primary() //PK
      table.string('medicine_name', 70)
      table.string('user_id', 10) // [FK]
      table.text('symtoms', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('drug_allergies')
  }
}

module.exports = DrugAllergySchema
