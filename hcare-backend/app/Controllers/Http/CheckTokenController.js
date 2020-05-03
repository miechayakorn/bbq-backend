"use strict";

class CheckTokenController {
  async check({ request, response, auth }) {
    try {
      const account = await auth.getUser();
      if (account) {
        return response.status(200).send();
      } else {
        return response.status(401).send();
      }
    } catch (error) {
      response.status(error.status).send(error);
    }
  }
}

module.exports = CheckTokenController;
