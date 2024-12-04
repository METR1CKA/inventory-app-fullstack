import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Pagina principal', () => {
    test('Debe de devolver la pagina principal', async ({ client }) => {
        const user = await User.findByOrFail('email', Env.get('EMAIL'))

        const responseLogin = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        responseLogin.assertStatus(200)
        responseLogin.assertRedirectsToRoute('/')

        const responseHome = await client.get('/').loginAs(user)

        responseHome.assertStatus(200)
        responseHome.assertTextIncludes('Bienvenido a Inventario App')
    })
})
