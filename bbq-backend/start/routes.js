'use strict'
const Database = use('Database')

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
const Route = use('Route')

Route.on('/').render('welcome')

Route.post('users', 'UserController.store')

Route.get('user2', async ({view}) => {
    const data = {
        users : []
    }
    data.users = await Database.table('users').select('*')
    return view.render('db', data)
})


