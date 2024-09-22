import CategoryValidator from 'App/Validators/Inventory/Category/CategoryValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { ValidatorException } from 'App/Exceptions/ValidatorException'

export default class CategoriesController {
    private categories = Category.query().orderBy('id', 'desc')

    public async index({ view }: HttpContextContract) {
        const categories = await this.categories

        return await view.render('inventory/category', { categories })
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(CategoryValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const data = request.only(['name'])

        await Category.create(data)

        session.flash('success-toast', 'Categoría creada')

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

        const data = request.only(['name'])

        await category.merge(data).save()

        session.flash('success-toast', 'Categoría actualizada')

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

        await category.merge({ active: !category.active }).save()

        session.flash(
            'success-toast',
            `Categoría ${category.active ? 'activada' : 'desactivada'}`,
        )

        return response.redirect().toRoute('categories.index')
    }
}
