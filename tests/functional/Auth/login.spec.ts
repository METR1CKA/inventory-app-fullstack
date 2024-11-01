import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'

test('Checar middleware de autenticación', async ({ client }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    response.assertRedirectsTo('/login')
})

test('Enviar credenciales para iniciar sesión', async ({ client }) => {
    const response = await client
        .post('/login')
        .form({
            email: Env.get('EMAIL'),
            password: Env.get('PASSWORD'),
        })
        .withCsrfToken()

    response.assertStatus(200)
    response.assertRedirectsTo('/')
})
