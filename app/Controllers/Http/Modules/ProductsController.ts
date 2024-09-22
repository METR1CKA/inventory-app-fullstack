import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormatDates from 'App/Services/FormatDates'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'
import ProductValidator from 'App/Validators/Inventory/Product/ProductValidator'
import { ValidatorException } from 'App/Exceptions/ValidatorException'

export default class ProductsController {
    public async index({ view }: HttpContextContract) {
        const products = await Product.query()
            .preload('category')
            .orderBy('id', 'desc')

        const categories = await Category.query()
            .where({ active: true })
            .orderBy('id', 'desc')

        return await view.render('inventory/product', {
            products,
            categories,
            format: FormatDates.serializeDates().serialize,
        })
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(ProductValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const data = request.only([
            'name',
            'description',
            'category_id',
            'stock',
        ])

        await Product.create(data)

        session.flash('success-toast', 'Producto creado')

        return response.created({
            status: 'Success',
            message: 'Producto creado',
            data: null,
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
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const product = await Product.find(params.id)

        if (!product) {
            return response.notFound({
                status: 'Error',
                message: 'Producto no encontrado',
                data: null,
            })
        }

        const data = request.only([
            'name',
            'description',
            'category_id',
            'stock',
        ])

        await product.merge(data).save()

        session.flash('success-toast', 'Producto actualizado')

        return response.ok({
            status: 'Success',
            message: 'Producto actualizado',
            data: null,
        })
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.redirect().clearQs().back()
        }

        await product.merge({ active: !product.active }).save()

        session.flash(
            'success-toast',
            `Producto ${product.active ? 'activado' : 'desactivado'}`,
        )

        return response.redirect().toRoute('products.index')
    }
}
