"use strict";

class UserController {
  async create({ request, response }) {
    try {
      const data = request.only([
        "first_name",
        "last_name",
        "email",
        "password",
        "telephone",
        "gender",
        "date_of_birth",
        "hn_number",
        "priviledge"
      ]);

      /*const userExists = await User.findBy("email", data.email);
      if (userExists) {
        return response
          .status(400)
          .send({ message: { error: "User already registered" } });
      }*/

      const dataUser = {
        gender : data.gender,
        date_of_birth : data.date_of_birth
      }
      const dataAccount = {
        password : data.password,
        hn_number : data.hn_number,
        first_name : data.first_name,
        last_name : data.last_name,
        priviledge : data.priviledge,
        email : data.email,
        telephone : data.telephone
      }
      console.log(dataUser)
      console.log(dataAccount)
      
      /*
      const user = await User.create(dataUser);
      const account = await Account.create(dataAccount);*/

      return data;
    } catch (err) {
      return response.status(err.status).send(err);
    }
  }
}

module.exports = UserController;
