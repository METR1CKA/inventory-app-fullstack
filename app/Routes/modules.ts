import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        Route.resource('users', 'UsersController').as('users')

        Route.resource('categories', 'CategoriesController').as('categories')

        Route.resource('products', 'ProductsController').as('products')
    }).namespace('App/Controllers/Http/Modules')

    Route.get('/', async ({ view }) => await view.render('home')).as('/')

    Route.post('forget-toast/:key', async ({ params, session, response }) => {
        if (params.key && session.has(params.key)) session.forget(params.key)
        return response.noContent()
    }).prefix('api/v1')
}).middleware('auth:web')
