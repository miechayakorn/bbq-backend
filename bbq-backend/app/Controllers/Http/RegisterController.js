"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");

class RegisterController {
  async create({ request, response }) {
    try {
      // getting data passed within the request
      const accountFromFontend = request.only([
        "password",
        "hn_number",
        "priviledge",
        "email",
        "telephone"
      ]);
      console.log(accountFromFontend);
      const account = await Account.create(accountFromFontend);
      return account;
    } catch (err) {
      return response.status(err.status).send(err);
    }
  }
}

module.exports = RegisterController;
