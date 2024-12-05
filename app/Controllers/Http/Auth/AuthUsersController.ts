import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/User'

export default class AuthUsersController {
    public async view({ view }: HttpContextContract) {
        return await view.render('auth/login')
    }

    public async login({
        auth,
        session,
        request,
        response,
    }: HttpContextContract) {
        const { email, password } = await request.validate(LoginValidator)

        try {
            await auth.use('web').verifyCredentials(email, password)
        } catch (error) {
            session.flash('error', 'Credenciales incorrectas')
            return response.redirect().back()
        }

        const user = await User.findBy('email', email)

        if (!user || !user.active) {
            session.flash('error', 'Usuario no encontrado')
            return response.redirect().back()
        }

        await auth.use('web').attempt(email, password)

        session.put('username', user.username)
        session.put('email', user.email)

        return response.redirect().toRoute('/')
    }

    public async logout({ auth, session, response }: HttpContextContract) {
        await auth.use('web').logout()
        session.clear()
        session.regenerate()

        return response.redirect().toRoute('login')
    }
}
