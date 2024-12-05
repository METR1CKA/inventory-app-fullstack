import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import * as cheerio from 'cheerio'
import { test } from '@japa/runner'

test.group('Usuarios', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('Debe obtener los usuarios', async ({ client }) => {
        const adminUser = await User.findOrFail(1)

        const users = await User.all()

        const response = await client
            .get('/users')
            .loginAs(adminUser)
            .withCsrfToken()

        response.assertSession('success-toast', 'Usuarios obtenidos con éxito')
        response.assertTextIncludes('Usuarios')

        const $ = cheerio.load(response.text())
        const rows = $('table#datatable-users tbody tr')
        response.assert?.equal(rows.length, users.length)
    }).tags(['test-user-1', 'success', 'users'])

    test('Debe fallar la validación de usuario con datos incorrectos', async ({
        client,
    }) => {
        const invalidData = { email: '', username: '' }

        const adminUser = await User.findOrFail(1)

        const response = await client
            .post('/users')
            .form(invalidData)
            .loginAs(adminUser)
            .withCsrfToken()

        response.assertSession(
            'error-toast',
            'Campos requeridos no completados',
        )
    }).tags(['test-user-2', 'error', 'users'])

    test('Debe crear un nuevo usuario', async ({ client }) => {
        const validData = { email: 'newuser@example.com', username: 'newuser' }

        await User.query().where('email', validData.email).delete()

        const adminUser = await User.findOrFail(1)

        const response = await client
            .post('/users')
            .form(validData)
            .loginAs(adminUser)
            .withCsrfToken()

        response.assertRedirectsToRoute('users.index')
        response.assertSession('success-toast', 'Usuarios obtenidos con éxito')

        const createdUser = await User.query()
            .where('email', validData.email)
            .first()

        response.assert?.exists(createdUser)
    }).tags(['test-user-3', 'success', 'users'])

    test('Debe actualizar un usuario existente', async ({ client }) => {
        const adminUser = await User.findOrFail(1)

        const user = await User.findOrFail(2)

        const oldData = { email: user.email, username: user.username }
        const updatedData = {
            email: 'updateduser@example.com',
            username: 'updateduser',
        }

        const response = await client
            .put(`/users/${user.id}`)
            .form(updatedData)
            .loginAs(adminUser)
            .withCsrfToken()

        response.assertRedirectsToRoute('users.index')
        response.assertSession('success-toast', 'Usuarios obtenidos con éxito')

        await user.refresh()

        response.assert?.notEqual(user.email, oldData.email)
        response.assert?.equal(user.email, updatedData.email)

        await user.merge(oldData).save()
    }).tags(['test-user-4', 'success', 'users'])

    test('Debe actualizar el estado de un usuario existente', async ({
        client,
    }) => {
        const adminUser = await User.findOrFail(1)

        const user = await User.findOrFail(2)

        const oldActive = user.active

        const response = await client
            .delete(`/users/${user.id}`)
            .loginAs(adminUser)
            .withCsrfToken()

        response.assertRedirectsToRoute('users.index')
        response.assertSession('success-toast', 'Usuarios obtenidos con éxito')

        await user.refresh()

        response.assert?.notEqual(user.active, oldActive)

        await user.merge({ active: oldActive }).save()
    }).tags(['test-user-5', 'success', 'users'])
})
