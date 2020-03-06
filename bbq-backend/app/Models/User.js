"use strict";


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  tokens() {
    return this.hasMany("App/Models/Token");
  }
  accounts(){
     return this.belongsTo("App/Models/Account")
  }

}

module.exports = User;
