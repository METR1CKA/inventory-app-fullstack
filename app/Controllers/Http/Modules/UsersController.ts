import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import UserValidator from 'App/Validators/Modules/UserValidator'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class UsersController {
    public async index({ session, view }: HttpContextContract) {
        const users = await User.all()

        session.put('success-toast', 'Usuarios obtenidos con éxito')

        return await view.render('modules/users/user', {
            users,
        })
    }

    public async create({ view }: HttpContextContract) {
        return await view.render('modules/users/user_create')
    }

    public async store({ session, request, response }: HttpContextContract) {
        try {
            await request.validate(UserValidator)
        } catch (errorValidation) {
            const [error_email, error_username] =
                ValidatorException(errorValidation)

            session.put('error-toast', 'Campos requeridos no completados')
            session.flash('error-email', error_email)
            session.flash('error-username', error_username)

            return response.redirect().back()
        }

        const data = request.only(['email', 'username'])

        const existUser = await User.query()
            .where({ email: data.email })
            .first()

        if (existUser) {
            session.put('error-toast', 'El email ya está registrado')
            session.flash('error-email', 'El email ya está registrado')

            return response.redirect().back()
        }

        const trx = await Database.transaction()

        try {
            await User.create({
                ...data,
                password: Env.get('PASSWORD'),
            })

            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put('error-toast', 'Error al crear el usuario')
            session.flash('error', error)

            return response.redirect().back()
        }

        return response.redirect().toRoute('users.index')
    }

    public async show({ response }: HttpContextContract) {
        return response.redirect().toRoute('users.index')
    }

    public async edit({ session, params, view }: HttpContextContract) {
        const user = await User.findOrFail(params.id)

        session.put('success-toast', 'Usuario obtenido con éxito')

        return await view.render('modules/users/user_update', {
            user,
        })
    }

    public async update({
        session,
        params,
        request,
        response,
    }: HttpContextContract) {
        try {
            await request.validate(UserValidator)
        } catch (errorValidation) {
            const [error_email, error_username] =
                ValidatorException(errorValidation)

            session.put('error-toast', 'Campos requeridos no completados')
            session.flash('error-email', error_email)
            session.flash('error-username', error_username)

            return response.redirect().back()
        }

        const user = await User.findOrFail(params.id)

        const data = request.only(['email', 'username'])

        if (user.email !== data.email) {
            const existUser = await User.query()
                .where({ email: data.email })
                .whereNot({ id: user.id })
                .first()

            if (existUser) {
                session.put('error-toast', 'El email ya está registrado')
                session.flash('error-email', 'El email ya está registrado')

                return response.redirect().back()
            }
        }

        const trx = await Database.transaction()

        try {
            await user.merge(data).save()
            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put('error-toast', 'Error al actualizar el usuario')

            return response.redirect().back()
        }

        return response.redirect().toRoute('users.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id)

        const trx = await Database.transaction()

        try {
            await user.merge({ active: !user.active }).save()
            await trx.commit()
        } catch (error) {
            console.error(error)
            await trx.rollback()

            session.put(
                'error-toast',
                `Error al ${user.active ? 'desactivar' : 'activar'} el usuario`,
            )

            return response.redirect().back()
        }

        return response.redirect().toRoute('users.index')
    }
}
