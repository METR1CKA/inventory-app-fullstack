import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'
import User from 'App/Models/User'

const OK = 200

test('Checar autenticación', async ({ client }) => {
    const response = await client.get('/')

    response.assertStatus(OK)
    response.assertRedirectsToRoute('login')
    response.assertTextIncludes('INVENTARIO')
})

test('Iniciar sesión correctamente', async ({ client }) => {
    const responseLogin = await client
        .post('/login')
        .form({
            email: Env.get('EMAIL'),
            password: Env.get('PASSWORD'),
        })
        .withCsrfToken()

    responseLogin.assertStatus(OK)
    responseLogin.assertRedirectsToRoute('/')

    const user = await User.findByOrFail('email', Env.get('EMAIL'))

    const responseHome = await client.get('/').loginAs(user)

    responseHome.assertStatus(OK)
    responseHome.assertTextIncludes('Bienvenido a Inventario App')
})

test('Inicio de sesión fallido por credenciales', async ({ client }) => {
    const response = await client
        .post('/login')
        .form({
            email: 'lorem@ipsum.com',
            password: '123',
        })
        .withCsrfToken()

    response.assertRedirectsToRoute('login')
})
