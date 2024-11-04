import ProductValidator from 'App/Validators/Modules/Product/ProductValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import FormatDates from 'App/Services/FormatDates'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'

export default class ProductsController {
    public async index({ session, view }: HttpContextContract) {
        const products = await Product.query()
            .preload('category')
            .orderBy('id', 'desc')

        const categories = await Category.query()
            .where({ active: true })
            .orderBy('id', 'desc')

        session.put('success-toast', 'Productos obtenidos con éxito')

        return await view.render('inventory/product', {
            products,
            categories,
            format: FormatDates.serializeDates().serialize,
        })
    }

    // public async store({ session, request, response }: HttpContextContract) {
    // }

    // public async update({
    //     session,
    //     params,
    //     request,
    //     response,
    // }: HttpContextContract) {
    // }

    public async destroy({ session, params, response }: HttpContextContract) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.redirect().clearQs().back()
        }

        const trx = await Database.transaction()

        try {
            await product.merge({ active: !product.active }).save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: `Error al ${
                    product.active ? 'desactivar' : 'activar'
                } el producto`,
                data: null,
            })
        }

        session.put(
            'success-toast',
            `Producto ${product.active ? 'activado' : 'desactivado'}`,
        )

        return response.redirect().toRoute('products.index')
    }
}
