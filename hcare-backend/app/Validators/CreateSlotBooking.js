"use strict";

class CreateSlotBooking {
  get rules() {
    return {
      type_id: "required|number|",
      date: "require|date",
    };
  }
}

module.exports = CreateSlotBooking;
