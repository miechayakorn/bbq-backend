"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const User = use("App/Models/User");

class UserRegisterController {
  async createUser({ request, response }) {
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

      const accountUser = await Account.create({
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
        account_id: accountUser.$attributes.account_id
      });
      console.log(accountUser);
      console.log(
        "------------------------------------------------------------------"
      );
      const userAdd = await User.findBy(
        "account_id",
        accountUser.$attributes.account_id
      );
      console.log(userAdd);

      await Database.table("accounts")
        .where("account_id", accountUser.$attributes.account_id)
        .update("user_id", userAdd.user_id);

      const sendAccount = await Account.find(
        accountUser.$attributes.account_id
      );
      return sendAccount;
    } catch (err) {
      return response.status(500).send(err);
    }
  }
}

module.exports = UserRegisterController;
