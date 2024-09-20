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
    Route.get('login', 'AuthUsersController.create').as('login')
    Route.post('login', 'AuthUsersController.store')
  }).middleware('guest')

  Route.post('logout', 'AuthUsersController.destroy').middleware('auth:web')
}).namespace('App/Controllers/Http/Auth')

Route.group(() => {
  Route.get('/', 'HomeController.index').as('/')

  Route.group(() => {
    Route.resource('categories', 'CategoriesController').as('categories')
    Route.resource('products', 'ProductsController').as('products')
    Route.resource('entries', 'EntriesController').as('entries')
  }).namespace('App/Controllers/Http/Modules')
}).middleware('auth:web')
