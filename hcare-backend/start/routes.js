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
Route.get("/confirmregister", "UserRegisterController.confirmRegister");
Route.post("/login", "AuthController.authenticate");

//staff register
Route.post("/staffRegister", "StaffRegisterController.createStaff");

Route.post("createtype", "CreateTypeController.create");
Route.post("updatetype", "CreateTypeController.update");
Route.post("createbooking", "CreateBookingController.create");

//for booking feature
Route.get("/ServiceTypes", "BookingController.showType");
Route.get("/ServiceDate/:type_id", "BookingController.showDate");
Route.get("/ServiceTime/:type_id", "BookingController.showTime");
Route.post("/Booking", "BookingController.submitBooking");
Route.get("/bookings/confirm", "BookingController.confirmBooking");

//show booking for individual user
Route.post("/myappointment", "BookingController.myAppointment");
Route.get(
  "/appointment/detail/:booking_id",
  "BookingController.myAppointmentDetail"
);

//Dashboard
Route.get("/showbooking", "BookingController.showBookingForHCAREDefault");
Route.get("/showbooking/:type/:date", "BookingController.showBookingForHCARE");
Route.get("/patientbooking/:booking_id", "BookingController.patientBooking");
Route.post("/patientbooking/edit", "BookingController.editPatientBooking");
Route.post("/cancel", "BookingController.cancelAppointment");
Route.get(
  "/patientbooking/detail/:booking_id",
  "BookingController.patientDetail"
);
