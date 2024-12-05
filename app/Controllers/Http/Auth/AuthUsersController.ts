import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import Logger from 'App/Services/Logger'
import User from 'App/Models/User'

export default class AuthUsersController {
    public async view({ request, view }: HttpContextContract) {
        Logger.info('Accessing login page', {
            request: {
                ip: request.ip(),
                url: request.url(),
                method: request.method(),
            },
        })

        return await view.render('auth/login')
    }

    public async login({
        auth,
        session,
        request,
        response,
    }: HttpContextContract) {
        const { email, password } = await request.validate(LoginValidator)

        Logger.info('Login attempt', {
            email,
            ip: request.ip(),
        })

        try {
            await auth.use('web').verifyCredentials(email, password)
        } catch (error) {
            Logger.warn('Failed login attempt', {
                email,
                ip: request.ip(),
                error,
            })

            session.flash('error', 'Credenciales incorrectas')
            return response.redirect().back()
        }

        const user = await User.findBy('email', email)

        if (!user || !user.active) {
            Logger.warn('Inactive user login attempt', {
                email,
                ip: request.ip(),
            })

            session.flash('error', 'Usuario no encontrado')

            return response.redirect().back()
        }

        await auth.use('web').attempt(email, password)

        session.put('username', user.username)
        session.put('email', user.email)

        Logger.info('Successful login', {
            user: { id: user.id, email: user.email },
            ip: request.ip(),
        })

        return response.redirect().toRoute('/')
    }

    public async logout({
        auth,
        session,
        response,
        request,
    }: HttpContextContract) {
        Logger.info('User logged out', {
            user: auth.user
                ? { id: auth.user.id, email: auth.user.email }
                : null,
            ip: request.ip(),
        })

        await auth.use('web').logout()
        session.clear()
        session.regenerate()

        return response.redirect().toRoute('login')
    }
}
