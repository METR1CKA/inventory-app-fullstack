import ProductValidator from 'App/Validators/Inventory/Product/ProductValidator'
import {
    getRandomNumberInRange,
    getNumberWithZero,
} from 'App/Services/Functions'
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

        const category = await Category.query()
            .where({ id: data.category_id })
            .first()

        if (!category) {
            return response.notFound({
                status: 'Error',
                message: 'Categoría no encontrada',
                data: null,
            })
        }

        const category_code = getNumberWithZero({ number: category.id })

        const random_number = getRandomNumberInRange({
            min: 1,
            max: 100,
            isDecimal: false,
        })
        const random_code = getNumberWithZero({ number: random_number })

        const trx = await Database.transaction()

        try {
            const product = await Product.create({
                ...data,
                sku: '-',
            })

            await trx.commit()

            await product
                .merge({
                    sku: `${category_code}${product.id}${random_code}`,
                })
                .save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: 'Error al crear el producto',
                data: null,
            })
        }

        session.put('success-toast', 'Producto creado')

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

        const category = await Category.query()
            .where({ id: data.category_id })
            .first()

        if (!category) {
            return response.notFound({
                status: 'Error',
                message: 'Categoría no encontrada',
                data: null,
            })
        }

        const category_code = getNumberWithZero({ number: category.id })
        const random_number = getRandomNumberInRange({
            min: 1,
            max: 100,
            isDecimal: false,
        })
        const random_code = getNumberWithZero({ number: random_number })

        const trx = await Database.transaction()

        try {
            await product
                .merge({
                    ...data,
                    sku: `${category_code}${product.id}${random_code}`,
                })
                .save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: 'Error al actualizar el producto',
                data: null,
            })
        }

        session.put('success-toast', 'Producto actualizado')

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
