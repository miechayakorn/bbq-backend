"use strict";
const Database = use("Database");
const Account = use("App/Models/Account");
const Token = use("App/Models/Token");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");
const RegisterRules = use("App/Validators/Register");
const { validateAll } = use("Validator");

class UserRegisterController {
  // create user and sendmail to confirm
  async createUser({ request, response }) {
    const data = request.only([
      "password",
      "hn_number",
      "email",
      "telephone",
      "first_name",
      "last_name",
    ]);

    try {
      await validateAll(data, RegisterRules);

      const accountUser = await Account.create({
        // password: data.password,
        hn_number: data.hn_number,
        first_name: data.first_name,
        last_name: data.last_name,
        role: "USER",
        email: data.email,
        telephone: data.telephone,
        verify: "NOT VERIFY",
      });

      if (accountUser) {
        const token = `${Date.now()}${accountUser.$attributes.hn_number}`;
        const tokenHash = await Hash.make(token);
        const dataForSendEmail = {
          account: await Database.table("accounts")
            .where("account_id", accountUser.$attributes.account_id)
            .first(),
          tokenHash,
          url: Env.get("VUE_APP_FONTEND_URL"),
        };
        console.log(dataForSendEmail);

        const sendMail = await Mail.send(
          "activateaccount",
          dataForSendEmail,
          (message) => {
            message
              .to(dataForSendEmail.account.email)
              .from("Mail from healthcare")
              .subject("Activate Register From Health Care");
          }
        );
        console.log(sendMail);

        if (sendMail) {
          const createTokenDB = await Token.create({
            account_id: dataForSendEmail.account.account_id,
            token: tokenHash,
            type: "REGISTER",
          });

          console.log(createTokenDB);

          return "sendmail success";
        } else {
          return response.status(500).send("cannot sendmail");
        }
      }
    } catch (err) {
      return response.status(500).send(err);
    }
  }

  // confirm after click in email
  async confirmRegister({ request, response }) {
    const query = request.get();
    try {
      console.log("token");
      console.log(query.token);
      if (query.token) {
        const accountConfirm = await Token.findBy("token", query.token);
        console.log(accountConfirm);
        if (accountConfirm) {
          await Account.query()
            .where("account_id", accountConfirm.account_id)
            .update({ verify: "SUCCESS" });
          return response.json({
            message: "Registration confirmation successful",
          });
        } else {
          return response.status(304).json({
            message: "This token is not available",
          });
        }
      } else {
        return response.status(500).json({
          message: "Token not exist",
        });
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

module.exports = UserRegisterController;
