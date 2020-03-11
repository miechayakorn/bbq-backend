"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const User = use("App/Models/User");

class RegisterController {
  async create({ request, response }) {
    try {
      const data = request.only([
        "password",
        "hn_number",
        "priviledge",
        "email",
        "telephone",
        "gender",
        "date_of_birth",
        "first_name",
        "last_name"
      ]);

      const account = await Account.create({
        password: data.password,
        hn_number: data.hn_number,
        priviledge: data.priviledge,
        email: data.email,
        telephone: data.telephone
      });

      const user = await User.create({
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        first_name: data.first_name,
        last_name: data.last_name,
        account_id: account.$attributes.id
      });
      console.log(account);
      console.log(
        "------------------------------------------------------------------"
      );
      console.log(user);

      await Database.table("accounts")
        .where("account_id", account.$attributes.id)
        .update("user_id", user.$attributes.id); // update foreign key to account

      console.log(account);
    } catch (err) {
      return response.status(err.status).send(err); //sent error message
    }
  }
}

module.exports = RegisterController;
