import CategoryValidator from 'App/Validators/Inventory/Category/CategoryValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { ValidatorException } from 'App/Exceptions/ValidatorException'

export default class CategoriesController {
    public async index({ view }: HttpContextContract) {
        const categories = await Category.all()
        return view.render('inventory/category', { categories })
    }

    public async store({ request, response }: HttpContextContract) {
        try {
            await request.validate(CategoryValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const data = request.only(['name'])

        await Category.create(data)

        return response.created({
            status: 'Success',
            message: 'Categoría creada',
            data: null,
        })
    }

    public async update({ params, request, response }: HttpContextContract) {
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

        return response.ok({
            status: 'Success',
            message: 'Categoría actualizada',
            data: null,
        })
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const category = await Category.find(params.id)

        if (!category) {
            session.flash('error-toast', 'Categoría no encontrada')
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
