"use strict";

const Database = use("Database");
const StaffHealthcare = use("App/Models/StaffHealthcare");
const Mail = use("Mail");
const Hash = use("Hash");
const Env = use("Env");

class HealthcareStaffAuthController {
  async createStaff({ request, response }) {
    const data = await request.only([
      "staff_id",
      "email",
      "password",
      "telephone",
      "first_name",
      "last_name",
      "role",
    ]);
    console.log(data);
    try {
      const staff = await StaffHealthcare.create({
        staff_id: data.staff_id,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        telephone: data.telephone,
        verify: "NOT VERIFY",
        role: data.role,
        privilege: "STAFF",
      });

      if (staff) {
        const token = `${Date.now()}${staff.$attributes.staff_id}`;
        const tokenHash = await Hash.make(token);

        const dataForSendEmail = {
          staff: await Database.table("staff_healthcares")
            .where("staff_id", data.staff_id)
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

        const s = await StaffHealthcare.query()
          .where("sh_id", dataForSendEmail.staff.sh_id)
          .update({ token: dataForSendEmail.tokenHash });
        return "sendmail success";
        // if (sendMail.rejectd == null) {
        // } else {
        //   return response.status(500).send("cannot sendmail");
        // }
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
        const staffconfirm = await StaffHealthcare.findBy("token", query.token);
        if (staffconfirm) {
          await StaffHealthcare.query()
            .where("sh_id", staffconfirm.sh_id)
            .update({ verify: "SUCCESS", token: null });
          response.redirect(`${Env.get("VUE_APP_FONTEND_URL")}/login`);
          //   return response.json({
          //     message: "Registration confirmation successful",
          //   });
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

module.exports = HealthcareStaffAuthController;
