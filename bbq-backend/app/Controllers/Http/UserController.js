"use strict";
const Database = use('Database')
const User = use('App/Models/User')
class UserController {
  async store({ request, response }) {
    try {
      //const data = request.all();
      const {gender, date_of_birth, drug_allergy,congenital_disorder} = request.all()
       await User.create({gender: gender, 
                          date_of_birth: date_of_birth,
                          drug_allergy: drug_allergy,
                          congenital_disorder: congenital_disorder})
      
    } catch (err) {
      return response.status(err.status).send(err);
    }
  }

  edit({ params, request }) {
    console.log("userid = ", params.id, "param", request.only(["name"]));
    return params;
  }
}

module.exports = UserController;
