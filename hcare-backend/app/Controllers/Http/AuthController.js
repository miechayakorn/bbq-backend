"use strict";
const Account = use("App/Models/Account");
const Hash = use("Hash");
const Database = use("Database");

class AuthController {
  async authenticate({ request, auth, response }) {
    const { hn_number, password } = request.only(["hn_number", "password"]);

    console.log(hn_number, password);
    try {
      if (await auth.attempt(hn_number, password)) {
        let account = await Account.findBy("hn_number", hn_number);

        let token = await auth.generate(account);

        let dataResp = {
          account_id: account.account_id,
          hn_number: account.hn_number,
          first_name: account.first_name,
          last_name: account.last_name,
          verify: account.verify,
          gender: account.gender,
          date_of_birth: account.date_of_birth,
          email: account.email,
          telephone: account.telephone,
          role: account.role,

          type: token.type,
          token: token.token,
          refreshToken: token.refreshToken
        };

        return response.json(dataResp);
      }
    } catch (error) {
      console.log(error);
      return response
        .status(401)
        .json({ message: "You are not registered!", error });
    }
  }
}

module.exports = AuthController;
