'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QueueSchema extends Schema {
  up () {
    this.create('queues', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('queues')
  }
}

module.exports = QueueSchema
