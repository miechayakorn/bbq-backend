"use strict";

const Database = use("Database");
const Account = use("App/Models/Account");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");
const Token = use("App/Models/Token");

class HealthcareStaffAuthController {
  async createStaff({ request, response }) {
    const data = await request.only([
      "staff_id",
      "email",
      "password",
      "telephone",
      "first_name",
      "last_name",
      "role_in_healthcare",
    ]);
    console.log(data);
    try {
      const staff = await Account.create({
        hn_number: data.staff_id,
        email: data.email,
        password: data.password,
        telephone: data.telephone,
        first_name: data.first_name,
        last_name: data.last_name,
        role: "STAFF",
        role_in_healthcare: data.role_in_healthcare,
        verify: "NOT VERIFY",
      });

      if (staff) {
        const token = `${Date.now()}${staff.$attributes.hn_number}`;
        const tokenHash = await Hash.make(token);

        const dataForSendEmail = {
          staff: await Database.table("accounts")
            .where("account_id", staff.$attributes.account_id)
            .first(),
          tokenHash,
          url: Env.get("VUE_APP_BACKEND_URL"),
        };
        console.log(dataForSendEmail);

        const sendMail = await Mail.send(
          "staffactivateaccount",
          dataForSendEmail,
          (message) => {
            message
              .to(dataForSendEmail.staff.email)
              .from("Mail from healthcare")
              .subject("Activate Staff Account");
          }
        );
        console.log(sendMail);
        if (sendMail) {
          await Token.create({
            account_id: dataForSendEmail.staff.account_id,
            token: tokenHash,
            type: "STAFF REGISTER",
          });
          return "sendmail success";
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
      if (query.token) {
        const accountConfirm = await Token.findBy("token", query.token);
        if (accountConfirm) {
          await Account.query()
            .where("account_id", accountConfirm.account_id)
            .update({ verify: "SUCCESS" });

          response.redirect(`${Env.get("VUE_APP_FONTEND_URL")}/login`);
          //   return response.json({
          //     message: "Registration confirmation successful",
          //   });
        } else {
          // return response.status(304).json({
          //   message: "This token is not available",
          // });
          response.redirect(`${Env.get("VUE_APP_FONTEND_URL")}/login`);
        }
      } else {
        // return response.status(500).json({
        //   message: "Token not exist",
        // });
        response.redirect(`${Env.get("VUE_APP_FONTEND_URL")}/login`);
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async staffLogin({ request, response, auth }) {
    const { email, password } = request.only(["email", "password"]);
    console.log(email, password);
    try {
      if (await auth.attempt(email, password)) {
        const staff = await Account.findBy("email", request.input("email"));
        const token = await auth.generate(staff);
        if (staff.role == "STAFF" || staff.role == "ADMIN") {
          let dataResp = {
            first_name: staff.first_name,
            last_name: staff.last_name,
            role: staff.role,
            type: token.type,
            token: token.token,
            refreshToken: token.refreshToken,
          };
          return response.json(dataResp);
        }
        console.log();
        return response.status(401).send("no permission");
      }
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
}

module.exports = HealthcareStaffAuthController;
