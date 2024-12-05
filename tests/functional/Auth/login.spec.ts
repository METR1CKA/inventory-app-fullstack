import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import Env from '@ioc:Adonis/Core/Env'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Autenticación', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('Debe iniciar sesión correctamente', async ({ client }) => {
        const response = await client
            .post('/login')
            .form({
                email: Env.get('EMAIL'),
                password: Env.get('PASSWORD'),
            })
            .withCsrfToken()

        response.assertRedirectsToRoute('/')
    }).tags(['test-auth-1', 'success', 'integración', 'auth'])

    test('Debe cerrar sesión correctamente', async ({ client }) => {
        const user = await User.findByOrFail('email', Env.get('EMAIL'))

        const response = await client
            .post('/logout')
            .loginAs(user)
            .withCsrfToken()

        response.assertRedirectsToRoute('login')
    }).tags(['test-auth-2', 'success', 'integración', 'auth'])

    test('Debe iniciar sesión de un usuario recién creado y cerrarla', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const response = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        response.assertRedirectsToRoute('/')

        const logoutResponse = await client
            .post('/logout')
            .loginAs(user)
            .withCsrfToken()

        logoutResponse.assertRedirectsToRoute('login')

        await user.delete()
    }).tags(['test-auth-3', 'success', 'sistema', 'auth'])

    test('Debe redirigir al login si no está autenticado', async ({
        client,
    }) => {
        const response = await client.get('/')

        response.assertRedirectsToRoute('login')
    }).tags(['test-auth-4', 'success', 'sistema', 'auth'])

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
    }).tags(['test-auth-5', 'error', 'componente', 'auth'])

    test('Debe fallar el inicio de sesión con usuario inactivo', async ({
        client,
    }) => {
        const user = await UserFactory.merge({ active: false }).create()

        const response = await client
            .post('/login')
            .form({
                email: user.email,
                password: user.password,
            })
            .withCsrfToken()

        response.assertRedirectsToRoute('login')

        await user.delete()
    }).tags(['test-auth-6', 'error', 'componente', 'auth'])
})
