"use strict";

class CreateSlotBooking {
  get rules() {
    return {
      type_id: "required|number|",
      date: "require|date",
      time_slot: "required|array",
    };
  }
}

module.exports = CreateSlotBooking;
