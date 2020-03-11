'use strict'

class CreateBookingController {

    async create({ request, response }) {
        try {
            const data = await request.only(['', '']);
            
            
        } catch (error) {
            return response.status(error.status).send(error)
        }
    }
}

module.exports = CreateBookingController
