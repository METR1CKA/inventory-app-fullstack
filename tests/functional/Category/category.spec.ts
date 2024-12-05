import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import * as cheerio from 'cheerio'

test.group('Categorias', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('Debe obtener las categorias', async ({ client }) => {
        const user = await User.findOrFail(1)

        const categories = await Category.all()

        const response = await client
            .get('/categories')
            .loginAs(user)
            .withCsrfToken()

        response.assertSession(
            'success-toast',
            'Categorias obtenidas con éxito',
        )
        response.assertTextIncludes('Categorías')

        const $ = cheerio.load(response.text())
        const rows = $('table#datatable-categories tbody tr')
        response.assert?.equal(rows.length, categories.length)
    }).tags(['test-category-1', 'success', 'categories'])

    test('Debe fallar la validación de categoría con datos incorrectos', async ({
        client,
    }) => {
        const invalidData = { name: '', description: '' }

        const user = await User.findOrFail(1)

        const response = await client
            .post('/categories')
            .form(invalidData)
            .loginAs(user)
            .withCsrfToken()

        response.assertSession(
            'error-toast',
            'Campos requeridos no completados',
        )
    }).tags(['test-category-2', 'error', 'categories'])

    test('Debe ingresar una categoria', async ({ client }) => {
        const validData = { name: 'Categoria 1', description: 'Descripción 1' }

        const user = await User.findOrFail(1)

        const response = await client
            .post('/categories')
            .form(validData)
            .loginAs(user)
            .withCsrfToken()

        response.assertRedirectsToRoute('categories.index')
        response.assertSession(
            'success-toast',
            'Categorias obtenidas con éxito',
        )
    }).tags(['test-category-3', 'success', 'categories'])

    test('Debe actualizar una categoría existente', async ({ client }) => {
        const user = await User.findOrFail(1)

        const category = await Category.findOrFail(1)

        const oldData = {
            name: category.name,
            description: category.description,
        }

        const updatedData = {
            name: 'Actualizado',
            description: 'Nueva descripción',
        }

        const response = await client
            .put(`/categories/${category.id}`)
            .form(updatedData)
            .loginAs(user)
            .withCsrfToken()

        response.assert?.notEqual(category.name, updatedData.name)

        await category.refresh()

        response.assert?.equal(category.name, updatedData.name)
        response.assertRedirectsToRoute('categories.index')
        response.assertSession(
            'success-toast',
            'Categorias obtenidas con éxito',
        )

        await category.merge(oldData).save()
    }).tags(['test-category-4', 'success', 'categories'])

    test('Debe actualizar el estado de una categoría existente', async ({
        client,
    }) => {
        const user = await User.findOrFail(1)

        const category = await Category.findOrFail(1)

        const oldActive = category.active

        const response = await client
            .delete(`/categories/${category.id}`)
            .loginAs(user)
            .withCsrfToken()

        response.assert?.equal(category.active, true)

        await category.refresh()

        response.assert?.equal(category.active, false)

        response.assertRedirectsToRoute('categories.index')
        response.assertSession(
            'success-toast',
            'Categorias obtenidas con éxito',
        )

        await category.merge({ active: oldActive }).save()
    }).tags(['test-category-5', 'success', 'categories'])
})
