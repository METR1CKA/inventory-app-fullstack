import CategoryValidator from 'App/Validators/Inventory/Category/CategoryValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

export default class CategoriesController {
    private categories = Category.query()
        .preload('subcategory')
        .orderBy('id', 'desc')

    public async index({ session, view }: HttpContextContract) {
        const categories = await this.categories

        const main_categories = await this.categories.whereNull(
            'main_category_id',
        )

        session.put('success-toast', 'Categorias obtenidas con éxito')

        return await view.render('inventory/category', {
            categories,
            main_categories,
        })
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(CategoryValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const data = request.only(['name', 'main_category_id'])

        const trx = await Database.transaction()

        try {
            await Category.create(data)

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: 'Error al crear la categoría',
                data: null,
            })
        }

        session.put('success-toast', 'Categoría creada')

        return response.created({
            status: 'Success',
            message: 'Categoría creada',
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
            await request.validate(CategoryValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const category = await Category.find(params.id)

        if (!category) {
            return response.notFound({
                status: 'Error',
                message: 'Categoría no encontrada',
                data: null,
            })
        }

        const data = request.only(['name', 'main_category_id'])

        const trx = await Database.transaction()

        try {
            await category.merge(data).save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: 'Error al actualizar la categoría',
                data: null,
            })
        }

        session.put('success-toast', 'Categoría actualizada')

        return response.ok({
            status: 'Success',
            message: 'Categoría actualizada',
            data: null,
        })
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const category = await Category.find(params.id)

        if (!category) {
            return response.redirect().clearQs().back()
        }

        const trx = await Database.transaction()

        try {
            await category.merge({ active: !category.active }).save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: `Error al ${
                    category.active ? 'desactivar' : 'activar'
                } la categoría`,
                data: null,
            })
        }

        session.put(
            'success-toast',
            `Categoría ${category.active ? 'activada' : 'desactivada'}`,
        )

        return response.redirect().toRoute('categories.index')
    }
}
