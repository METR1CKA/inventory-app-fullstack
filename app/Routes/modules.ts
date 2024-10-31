import Route from '@ioc:Adonis/Core/Route'

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
}).middleware(['toast', 'auth:web'])
