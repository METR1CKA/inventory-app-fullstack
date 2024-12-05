import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Pagina principal', () => {
    test('No debe acceder a la pagina principal', async ({ client }) => {
        const response = await client.get('/')

        response.assertRedirectsToRoute('login')
    }).tags(['test-home-1', 'error', 'home'])

    test('Debe de devolver la pagina principal', async ({ client }) => {
        const user = await User.findByOrFail('email', Env.get('EMAIL'))

        const responseLogin = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        responseLogin.assertRedirectsToRoute('/')

        const responseHome = await client.get('/').loginAs(user)

        responseHome.assertTextIncludes('Bienvenido a Inventario App')

        const responseLogout = await client
            .post('/logout')
            .loginAs(user)
            .withCsrfToken()

        responseLogout.assertRedirectsToRoute('login')
    }).tags(['test-home-2', 'success', 'home'])
})
