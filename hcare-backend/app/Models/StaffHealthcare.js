"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Hash = use("Hash");

class StaffHealthcare extends Model {
  static get primaryKey() {
    return "sh_id";
  }
  static boot() {
    super.boot();
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }
}

module.exports = StaffHealthcare;
