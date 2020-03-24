"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const User = use("App/Models/User");
const Mail = use("Mail");

class UserRegisterController {
  async createUser({ request, response }) {
    try {
      const data = request.only([
        "password",
        "hn_number",
        "priviledge",
        "email",
        "telephone",
        // "gender",
        // "date_of_birth",
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
        // gender: data.gender,
        // date_of_birth: data.date_of_birth,
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

      const updateaccount = await Database.table("accounts")
        .where("account_id", accountUser.$attributes.account_id)
        .update("user_id", userAdd.user_id);

      console.log("*************************************" + updateaccount);
      if (updateaccount) {
        const token = `${Date.now()}${accountUser.$attributes.hn_number}`;

        const dataForSendEmail = {
          account: await Database.table("accounts")
            .where("account_id", accountUser.$attributes.account_id)
            .first(),
          user: await Database.table("users")
            .where("user_id", userAdd.user_id)
            .first(),
          token
        };

        console.log(dataForSendEmail);

        const sendMail = await Mail.send(
          "activateEmail",
          dataForSendEmail,
          message => {
            message
              .to(dataForSendEmail.account.email)
              .from("Mail from healthcare")
              .subject("Activate Register From Health Care");
          }
        );

        console.log("00000000000000000000000000000000000000000000");
        console.log(sendMail);

        if (sendMail) {
          await Database.table("accounts")
            .where("account_id", dataForSendEmail.account.account_id)
            .update({ activate: "waiting activate", token_activate: token });

          return "sendmail success";
        } else {
          return " cannot sendmail ";
        }
      }
    } catch (err) {
      return response.status(500).send(err);
    }
  }

  async confirmRegister({ request, response }) {
    const query = request.get();
    if (query.token) {
      const accountConfirm = await Account.findBy("token_activate", query.token);

      console.log("---------------------------------------------");
      console.log("accountConfirm");

      if (accountConfirm) {
        await Account.query()
          .where("account_id", accountConfirm.account_id)
          .update({ activate: "activate successfully" });

        const accountRegisterSuccessfully = await Account.find(
          accountConfirm.account_id
        );

        return response.json({
          message: "Register successfully",
          booking: accountRegisterSuccessfully
        });
      }
    } else {
      return response.json({
        message: "token not exist"
      });
    }
  }
}

module.exports = UserRegisterController;
