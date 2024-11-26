import CategoryValidator from 'App/Validators/Modules/CategoryValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

export default class CategoriesController {
    public async index({ session, view }: HttpContextContract) {
        const categories = await Category.all()

        session.put('success-toast', 'Categorias obtenidas con éxito')

        return await view.render('modules/categories/category', {
            categories,
        })
    }

    public async create({ view }: HttpContextContract) {
        return await view.render('modules/categories/category_create')
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(CategoryValidator)
        } catch (error) {
            const { errors } = ValidatorException(error)

            session.put('error-toast', 'Campos requeridos no completados')

            for (let keyError in errors) {
                session.flash(keyError, errors[keyError])
            }

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

            session.put('error-toast', 'Error al crear la categoría')

            return response.redirect().back()
        }

        return response.redirect().toRoute('categories.index')
    }

    public async show({ response }: HttpContextContract) {
        return response.redirect().toRoute('categories.index')
    }

    public async edit({ session, params, view }: HttpContextContract) {
        const category = await Category.findOrFail(params.id)

        session.put('success-toast', 'Categoría obtenida con éxito')

        return await view.render('modules/categories/category_update', {
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
        } catch (error) {
            const { errors } = ValidatorException(error)

            session.put('error-toast', 'Campos requeridos no completados')

            for (let keyError in errors) {
                session.flash(keyError, errors[keyError])
            }

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

            session.put('error-toast', 'Error al actualizar la categoría')

            return response.redirect().back()
        }

        return response.redirect().toRoute('categories.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const category = await Category.findOrFail(params.id)

        const trx = await Database.transaction()

        try {
            await category.merge({ active: !category.active }).save()

            await trx.commit()
        } catch (error) {
            console.error(error)

            await trx.rollback()

            session.put(
                'error-toast',
                `Error al ${
                    category.active ? 'desactivar' : 'activar'
                } la categoría`,
            )

            return response.redirect().back()
        }

        return response.redirect().toRoute('categories.index')
    }
}
