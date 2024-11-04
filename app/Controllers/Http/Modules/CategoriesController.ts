import CategoryValidator from 'App/Validators/Inventory/Category/CategoryValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import { success_toast, error_toast } from 'App/Services/Functions'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

export default class CategoriesController {
    private categories = Category.query().orderBy('id', 'desc')

    public async index({ session, view }: HttpContextContract) {
        const categories = await this.categories

        session.put(success_toast, 'Categorias obtenidas con éxito')

        return await view.render('inventory/categories/category', {
            categories,
        })
    }

    public async create({ view }: HttpContextContract) {
        return await view.render('inventory/categories/category_create')
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(CategoryValidator)
        } catch (errorValidation) {
            const error = ValidatorException(errorValidation)

            session.put(error_toast, 'Campos requeridos no completados')
            session.flash('error-name', error[0])

            return response.redirect().back()
        }

        const trx = await Database.transaction()

        const data = request.only(['name', 'description'])

        try {
            await Category.create(data)
            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put(error_toast, 'Error al crear la categoría')
            session.flash('error', error)

            return response.redirect().back()
        }

        return response.redirect().toRoute('categories.index')
    }

    public async edit({
        session,
        params,
        response,
        view,
    }: HttpContextContract) {
        const category = await Category.find(params.id)

        if (!category) {
            session.put(error_toast, 'Categoría no encontrada')
            return response.redirect().back()
        }

        return await view.render('inventory/categories/category_update', {
            category,
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
        } catch (errorValidation) {
            const error = ValidatorException(errorValidation)

            session.put('error_toast', 'Campos requeridos no completados')
            session.flash('error-name', error[0])

            return response.redirect().back()
        }

        const category = await Category.findOrFail(params.id)
        const data = request.only(['name', 'description'])

        const trx = await Database.transaction()

        try {
            await category.merge(data).save()
            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put(error_toast, 'Error al actualizar la categoría')
            session.flash('error', error)

            return response.redirect().back()
        }

        return response.redirect().toRoute('categories.index')
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

            session.put(error_toast, 'Error al eliminar la categoría')

            return response.redirect().back()
        }

        session.put(
            success_toast,
            `Categoría ${category.active ? 'activada' : 'desactivada'}`,
        )

        return response.redirect().toRoute('categories.index')
    }
}
