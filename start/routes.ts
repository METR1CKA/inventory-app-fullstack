/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        Route.get('login', 'AuthUsersController.view').as('login')
        Route.post('login', 'AuthUsersController.login')
    }).middleware('guest')

    Route.post('logout', 'AuthUsersController.logout').middleware('auth:web')
}).namespace('App/Controllers/Http/Auth')

Route.group(() => {
    Route.get('/', 'HomeController.index').as('/')

    Route.group(() => {
        Route.resource('categories', 'CategoriesController')
            .as('categories')
            .only(['index', 'store', 'update', 'destroy'])

        Route.resource('products', 'ProductsController')
            .as('products')
            .only(['index', 'store', 'update', 'destroy'])

        Route.resource('entries', 'EntriesController')
            .as('entries')
            .only(['index', 'store', 'update'])
    }).namespace('App/Controllers/Http/Modules')
}).middleware('auth:web')

Route.any('*', async ({ view }) => {
    return await view.render('errors/not-found')
})
