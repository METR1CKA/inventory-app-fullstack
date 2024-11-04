import ProductValidator from 'App/Validators/Modules/ProductValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
// import FormatDates from 'App/Services/FormatDates'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'

export default class ProductsController {
    public async index({ session, view }: HttpContextContract) {
        const products = await Product.query()
            .preload('category')
            .orderBy('id', 'desc')

        session.put('success-toast', 'Productos obtenidos con éxito')

        return await view.render('modules/products/product', {
            products,
            // format: FormatDates.serializeDates().serialize,
        })
    }

    public async create({ view }: HttpContextContract) {
        const categories = await Category.all()

        return await view.render('modules/products/product_create', {
            categories,
        })
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(ProductValidator)
        } catch (errorValidation) {
            const { category_id, name, stock } =
                ValidatorException(errorValidation)

            session.put('error-toast', 'Campos requeridos no completados')

            if (category_id) {
                session.flash('error-category_id', category_id)
            }

            if (name) {
                session.flash('error-name', name)
            }

            if (stock) {
                session.flash('error-stock', stock)
            }

            return response.redirect().back()
        }

        const trx = await Database.transaction()

        const data = request.only([
            'category_id',
            'name',
            'stock',
            'description',
            'sku',
        ])

        try {
            await Product.create(data)
            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put('error-toast', 'Error al crear el producto')

            return response.redirect().back()
        }

        return response.redirect().toRoute('products.index')
    }

    public async show({ response }: HttpContextContract) {
        return response.redirect().toRoute('products.index')
    }

    public async edit({ session, params, view }: HttpContextContract) {
        const product = await Product.findOrFail(params.id)

        const categories = await Category.all()

        session.put('success-toast', 'Producto obtenido con éxito')

        return await view.render('modules/products/product_update', {
            product,
            categories,
        })
    }

    public async update({
        session,
        params,
        request,
        response,
    }: HttpContextContract) {
        try {
            await request.validate(ProductValidator)
        } catch (errorValidation) {
            const { category_id, name, stock } =
                ValidatorException(errorValidation)

            session.put('error-toast', 'Campos requeridos no completados')

            if (category_id) {
                session.flash('error-category_id', category_id)
            }

            if (name) {
                session.flash('error-name', name)
            }

            if (stock) {
                session.flash('error-stock', stock)
            }

            return response.redirect().back()
        }

        const product = await Product.findOrFail(params.id)

        const data = request.only([
            'category_id',
            'name',
            'stock',
            'description',
            'sku',
        ])

        const trx = await Database.transaction()

        try {
            await product.merge(data).save()

            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put('error-toast', 'Error al actualizar el producto')

            return response.redirect().back()
        }

        return response.redirect().toRoute('products.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const product = await Product.findOrFail(params.id)

        const trx = await Database.transaction()

        try {
            await product.merge({ active: !product.active }).save()

            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put(
                'error-toast',
                `Error al ${
                    product.active ? 'desactivar' : 'activar'
                } el producto`,
            )

            return response.redirect().back()
        }

        return response.redirect().toRoute('products.index')
    }
}
