"use strict";

class DateService {
  static ChangeDateFormat = (date) => {
    const subDate = date.split(" ");

    const dayOfWeek = this.changeDay(subDate[0]);

    const monthOfYear = this.changeMonth(subDate[2]);

    const year = parseInt(subDate[3]) + 543;

    return `วัน${dayOfWeek} ที่ ${subDate[1]} ${monthOfYear} ${year}`;
  };

  static changeDay = (days) => {
    console.log(days);
    let day;
    switch (days) {
      case "Monday":
        day = "จันทร์";
        break;
      case "Tuesday":
        day = "อังคาร";
        break;
      case "Wednesday":
        day = "พุธ";
        break;
      case "Thursday":
        day = "พฤหัสบดี";
        break;
      case "Friday":
        day = "ศุกร์";
        break;
      case "Saturday":
        day = "เสาร์";
        break;
      case "Sunday":
        day = "อาทิตย์";
        break;
      default:
        day = days;
        break;
    }
    return day;
  };

  static changeMonth = (months) => {
    let month;
    switch (months) {
      case "January":
        month = "มกราคม";
        break;
      case "February":
        month = "กุมภาพันธ์";
        break;
      case "March":
        month = "มีนาคม";
        break;
      case "April":
        month = "เมษายน";
        break;
      case "May":
        month = "พฤษภาคม";
        break;
      case "June":
        month = "มิถุนายน";
        break;
      case "July":
        month = "กรกฎาคม";
        break;
      case "August":
        month = "สิงหาคม";
        break;
      case "September":
        month = "กันยายน";
        break;
      case "October":
        month = "ตุลาคม";
        break;
      case "November":
        month = "พฤศจิกายน";
        break;
      case "December":
        month = "ธันวาคม";
        break;

      default:
        month = month;
        break;
    }
    return month;
  };

  static dateToDay = (day) => {
    
    if (day == 0) {
      return "SUNDAY";
    } else if (day == 1) {
      return "MONDAY";
    } else if (day == 2) {
      return "TUESDAY";
    } else if (day == 3) {
      return "WEDNESDAY";
    } else if (day == 4) {
      return "THURSDAY";
    } else if (day == 5) {
      return "FRIDAY";
    } else if (day == 6) {
      return "SATURDAY";
    }
  };
}

module.exports = DateService;
