import Route from '@ioc:Adonis/Core/Route'

async function getHome({ view }) {
    return view.render('home')
}

async function removeToast({ params, session, response }) {
    if (params.key && session.has(params.key)) session.forget(params.key)
    return response.noContent()
}

Route.group(() => {
    Route.group(() => {
        Route.resource('users', 'UsersController').as('users')

        Route.resource('categories', 'CategoriesController').as('categories')

        Route.resource('products', 'ProductsController').as('products')
    }).namespace('App/Controllers/Http/Modules')

    Route.get('/', getHome).as('/')

    Route.post('forget-toast/:key', removeToast).prefix('api/v1')
}).middleware(['auth:web', 'parseId'])
