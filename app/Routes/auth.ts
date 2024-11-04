import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        Route.get('login', 'AuthUsersController.view').as('login')
        Route.post('login', 'AuthUsersController.login')
    }).middleware('guest')

    Route.post('logout', 'AuthUsersController.logout').middleware('auth:web')
}).namespace('App/Controllers/Http/Auth')
