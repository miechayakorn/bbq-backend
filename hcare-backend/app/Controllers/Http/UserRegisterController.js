"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const Token = use("App/Models/Token");
const Mail = use("Mail");
const Hash = use("Hash");

class UserRegisterController {
  async createUser({ request, response }) {
    try {
      const data = request.only([
        "password",
        "hn_number",
        "email",
        "telephone",
        "first_name",
        "last_name"
      ]);

      console.log(data);

      const accountUser = await Account.create({
        password: data.password,
        hn_number: data.hn_number,
        first_name: data.first_name,
        last_name: data.last_name,
        role: "user",
        email: data.email,
        telephone: data.telephone
      });

      if (accountUser) {
        const token = `${Date.now()}${accountUser.$attributes.hn_number}`;
        const tokenHash = await Hash.make(token);
        const dataForSendEmail = {
          account: await Database.table("accounts")
            .where("account_id", accountUser.$attributes.account_id)
            .first(),
          tokenHash
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
          const createTokenDB = await Token.create({
            account_id: dataForSendEmail.account.account_id,
            token: tokenHash,
            type: "Register"
          });

          console.log(createTokenDB);

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
      const accountConfirm = await Token.findBy("token", query.token);

      console.log("---------------------------------------------");
      console.log(accountConfirm);

      if (accountConfirm) {
        await Account.query()
          .where("account_id", accountConfirm.account_id)
          .update({ verify: true });

        const accountRegisterSuccessfully = await Account.find(
          accountConfirm.account_id
        );

        // return response.json({
        //   message: "Register successfully",
        //   booking: accountRegisterSuccessfully
        // });
        return response.redirect("http://localhost:8080/Login");
      }
    } else {
      return response.json({
        message: "token not exist"
      });
    }
  }
}

module.exports = UserRegisterController;
