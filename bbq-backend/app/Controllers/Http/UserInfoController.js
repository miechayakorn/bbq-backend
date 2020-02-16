"use strict";

class UserInfoController {
  async store({ request, response }) {
    try {
      const data = request.only(["userid"]);
      console.log(data);
    } catch {
      return response.status(err.status).send(err);
    }
  }
}

module.exports = UserInfoController;
