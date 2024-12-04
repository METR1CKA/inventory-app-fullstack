import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Autenticación', () => {
    test('Debe iniciar sesión correctamente', async ({ client }) => {
        const response = await client
            .post('/login')
            .form({
                email: Env.get('EMAIL'),
                password: Env.get('PASSWORD'),
            })
            .withCsrfToken()

        response.assertStatus(200)
        response.assertRedirectsToRoute('/')
    })

    test('Debe iniciar sesión de un usuario recién creado y cerrarla', async ({
        client,
    }) => {
        const user = await User.create({
            email: 'test@gmail.com',
            password: 'test.123',
            username: 'tester',
            active: true,
        })

        const response = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        response.assertStatus(200)
        response.assertRedirectsToRoute('/')

        const logoutResponse = await client
            .post('/logout')
            .loginAs(user)
            .withCsrfToken()

        logoutResponse.assertRedirectsToRoute('login')

        await user.delete()
    })

    test('Debe cerrar sesión correctamente', async ({ client }) => {
        const user = await User.findByOrFail('email', Env.get('EMAIL'))

        const response = await client
            .post('/logout')
            .loginAs(user)
            .withCsrfToken()

        response.assertRedirectsToRoute('login')
    })

    test('Debe redirigir al login si no está autenticado', async ({
        client,
    }) => {
        const response = await client.get('/')

        response.assertStatus(200)
        response.assertRedirectsToRoute('login')
    })

    test('Debe fallar el inicio de sesión con credenciales incorrectas', async ({
        client,
    }) => {
        const response = await client
            .post('/login')
            .form({
                email: 'wrong@example.com',
                password: 'wrongpassword',
            })
            .withCsrfToken()

        response.assertRedirectsToRoute('login')
    })

    test('Debe fallar el inicio de sesión con usuario inactivo', async ({
        client,
    }) => {
        const user = await User.create({
            email: 'inactive@example.com',
            password: 'password',
            username: 'inactiveuser',
            active: false,
        })

        const response = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        response.assertRedirectsToRoute('login')

        await user.delete()
    })
})
