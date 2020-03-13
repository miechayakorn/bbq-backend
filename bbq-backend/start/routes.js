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
//Route.post('users', 'UserController.store')
Route.post("register", "RegisterController.create");
// Route.get("showaccount", async () => {
//   let user = await Database.table("accounts").select();
//   return user;
// });
//Route.post('register', 'UserController.create')

Route.post("createtype", "CreateTypeController.create");
Route.post("updatetype", "CreateTypeController.update");
Route.post("createbooking", "CreateBookingController.create");

Rounte.get("/ServiceTypes","")

