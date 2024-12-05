import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import Category from 'App/Models/Category'
import User from 'App/Models/User'
import * as cheerio from 'cheerio'
import { test } from '@japa/runner'

test.group('Productos', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('Debe obtener los productos', async ({ client }) => {
        const user = await User.findOrFail(1)

        const products = await Product.query().preload('category')

        const response = await client
            .get('/products')
            .loginAs(user)
            .withCsrfToken()

        response.assertSession('success-toast', 'Productos obtenidos con éxito')
        response.assertTextIncludes('Productos')

        const $ = cheerio.load(response.text())
        const rows = $('table#datatable-products tbody tr')
        response.assert?.equal(rows.length, products.length)
    }).tags(['test-product-1', 'success', 'products'])

    test('Debe fallar la validación de producto con datos incorrectos', async ({
        client,
    }) => {
        const invalidData = {
            name: '',
            category_id: '',
            stock: '',
            description: '',
            sku: '',
        }

        const user = await User.findOrFail(1)

        const response = await client
            .post('/products')
            .form(invalidData)
            .loginAs(user)
            .withCsrfToken()

        response.assertSession(
            'error-toast',
            'Campos requeridos no completados',
        )
    }).tags(['test-product-2', 'error', 'products'])

    test('Debe ingresar un producto', async ({ client }) => {
        const category = await Category.firstOrFail()

        const validData = {
            name: 'Producto 1',
            category_id: category.id,
            stock: 50,
            description: 'Descripción del producto',
            sku: 'SKU12345',
        }

        const user = await User.findOrFail(1)

        const response = await client
            .post('/products')
            .form(validData)
            .loginAs(user)
            .withCsrfToken()

        response.assertRedirectsToRoute('products.index')
        response.assertSession('success-toast', 'Productos obtenidos con éxito')
    }).tags(['test-product-3', 'success', 'products'])

    test('Debe actualizar un producto existente', async ({ client }) => {
        const category = await Category.firstOrFail()

        const user = await User.findOrFail(1)

        const product = await Product.findOrFail(1)

        const oldData = {
            name: product.name,
            category_id: product.category_id,
            description: product.description,
            stock: product.stock,
            sku: product.sku,
        }

        const updatedData = {
            name: 'Producto Actualizado',
            category_id: category.id,
            description: 'Nueva descripción del producto',
            stock: 100,
            sku: 'SKU54321',
        }

        const response = await client
            .put(`/products/${product.id}`)
            .form(updatedData)
            .loginAs(user)
            .withCsrfToken()

        response.assert?.notEqual(product.name, updatedData.name)

        response.assertRedirectsToRoute('products.index')
        response.assertSession('success-toast', 'Productos obtenidos con éxito')

        await product.refresh()

        response.assert?.equal(product.name, updatedData.name)

        await product.merge(oldData).save()
    }).tags(['test-product-4', 'success', 'products'])

    test('Debe actualizar el estado de un producto existente', async ({
        client,
    }) => {
        const user = await User.findOrFail(1)

        const product = await Product.findOrFail(1)

        const oldActive = product.active

        const response = await client
            .delete(`/products/${product.id}`)
            .loginAs(user)
            .withCsrfToken()

        response.assertRedirectsToRoute('products.index')
        response.assertSession('success-toast', 'Productos obtenidos con éxito')

        await product.refresh()

        response.assert?.notEqual(product.active, oldActive)

        await product.merge({ active: oldActive }).save()
    }).tags(['test-product-5', 'success', 'products'])
})
