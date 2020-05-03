"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const Staff = use("App/Models/Staff");
class RegisterController {
  async createStaff({ request, response }) {
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

      const staff = await Staff.create({
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        first_name: data.first_name,
        last_name: data.last_name,
        account_id: account.$attributes.account_id
      });

      console.log(account);
      console.log(
        "------------------------------------------------------------------"
      );
      const staffAdd = await Staff.findBy(
        "account_id",
        account.$attributes.account_id
      );
      console.log(staffAdd);

      await Database.table("accounts")
        .where("account_id", account.$attributes.account_id)
        .update("staff_id", staffAdd.staff_id); // update foreign key to account
      const sendAccount = await Account.find(account.$attributes.account_id);
      return sendAccount;
    } catch (err) {
      return response.status(500).send(err);
    }
  }
}

module.exports = RegisterController;
