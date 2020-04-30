"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use("Route");
const Database = use("Database");

Route.on("/").render("welcome");

//user register & login
Route.post("/register", "UserRegisterController.createUser");
Route.get("/register/confirm", "UserRegisterController.confirmRegister");
Route.group(() => {
  Route.post("/login", "AuthController.authenticate");
  Route.post("/login/confirm", "AuthController.confirmauthenticate");
}).middleware("guest");
Route.get("/user/me", "AuthController.myprofile").middleware("auth"); //test token

//staff and admin authentication (Register & Login)
Route.post("/staff/register", "HealthcareStaffAuthController.createStaff");
Route.get(
  "/staff/register/confirm",
  "HealthcareStaffAuthController.confirmRegister"
);

//staff modify
Route.post("/servicetype/create", "BookingServiceController.create");
Route.post("updatetype", "CreateTypeController.update");
Route.post("createbooking/check", "CreateBookingController.checkWorktime");
Route.post("createbooking", "CreateBookingController.store");

//for booking feature
Route.get("/ServiceTypes", "BookingController.showType");
Route.get("/ServiceDate/:type_id", "BookingController.showDate");
Route.get("/ServiceTime/:type_id", "BookingController.showTime");
Route.group(() => {
  Route.post("/Booking", "BookingController.submitBooking");
}).middleware("auth");
Route.get("/bookings/confirm", "BookingController.confirmBooking");

//show booking for individual user
Route.group(() => {
  Route.get("/myappointment", "AppointmentController.myAppointment");
  Route.get(
    "/appointment/detail/:booking_id",
    "AppointmentController.myAppointmentDetail"
  );
  Route.post(
    "/appointment/cancel",
    "AppointmentController.cancelAppointmentFromAppointmentDetail"
  );
}).middleware("auth");

//Dashboard Booking
Route.get(
  "/showbooking/:type/:date",
  "DashboardBookingController.showBookingForHCARE"
);
Route.post(
  "/patientbooking/edit",
  "DashboardBookingController.editPatientBooking"
);
Route.post("/cancel", "DashboardBookingController.cancelAppointment"); // ผู้ป่วยยกเลิกก็ใช้ controller นี้
Route.post(
  "/booking/healthcare",
  "DashboardBookingController.submitBookingFromHealthcare"
);
//Route.get("/patientbooking/detail/:booking_id", "BookingController.patientDetail");
