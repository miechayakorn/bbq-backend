"use strict";
const Account = use("App/Models/Account");
const Hash = use("Hash");
const Database = use("Database");

class AuthController {
  async authenticate({ request, auth, response }) {
    const { hn_number, password } = request.only(["hn_number", "password"]);
    try {
      if (await auth.attempt(hn_number, password)) {
        let account = await Account.findBy("hn_number", hn_number);
        
        let token = await auth.generate(account);

        Object.assign(account, token);

        return response.json(account);
      }
    } catch (error) {
      console.log(error);
      return response.status(401).json({ message: "You are not registered!", error });
    }
  }
}

module.exports = AuthController;
