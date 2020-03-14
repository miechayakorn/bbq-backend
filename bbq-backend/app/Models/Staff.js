'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Staff extends Model {
  static get primaryKey() {
    return "staff_id";
  }
}

module.exports = Staff
