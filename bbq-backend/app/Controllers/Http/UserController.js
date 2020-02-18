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
      const userExists = await User.findBy("email", data.email);
      if (userExists) {
        return response
          .status(400)
          .send({ message: { error: "User already registered" } });
      }

      const user = await User.create(data);
      const account = await Account.create(data);

      return user;
    } catch (err) {
      return response.status(err.status).send(err);
    }
  }
}

module.exports = UserController;
