"use strict";

class Register {
  get rules() {
    return {
      password: "required|number|",
      hn_number: "required|number|unique:accounts",
      email: "required|email|unique:accounts",
      telephone: "required|number",
      first_name: "required",
      last_name: "required",
    };
  }
}

module.exports = Register;
