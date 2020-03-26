'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('tokens', (table) => {
      table.increments('token_id').primary()
      table.integer('account_id').unsigned() //[FK]
      table.string('token').notNullable().unique().index()
      table.string('type').notNullable()
      table.boolean('is_revoked').defaultTo(false)
      
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = TokensSchema
