import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import {
    DatabaseException,
    ValidatorException,
} from 'App/Exceptions/ValidatorException'
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
        } catch (error) {
            ValidatorException({
                catchError: error,
                session,
            })

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
            await User.create(
                {
                    ...data,
                    password: Env.get('PASSWORD', 'default.password'),
                },
                trx,
            )

            await trx.commit()
        } catch (error) {
            await DatabaseException({ catchError: error, session, trx })

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
        } catch (error) {
            ValidatorException({
                catchError: error,
                session,
            })

            return response.redirect().back()
        }

        const user = await User.find(params.id)

        if (!user) {
            session.put('error-toast', 'Usuario no encontrado')

            return response.redirect().back()
        }

        const data = request.only(['email', 'username'])

        if (data.email && data.email !== user.email) {
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
            await user.useTransaction(trx).merge(data).save()

            await trx.commit()
        } catch (error) {
            await DatabaseException({ catchError: error, session, trx })

            return response.redirect().back()
        }

        return response.redirect().toRoute('users.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id)

        const trx = await Database.transaction()

        try {
            await user
                .useTransaction(trx)
                .merge({ active: !user.active })
                .save()

            await trx.commit()
        } catch (error) {
            await DatabaseException({ catchError: error, session, trx })

            return response.redirect().back()
        }

        return response.redirect().toRoute('users.index')
    }
}
