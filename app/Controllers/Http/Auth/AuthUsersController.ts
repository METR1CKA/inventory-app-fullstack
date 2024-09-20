import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/Auth/LoginValidator'

export default class AuthUsersController {
  public async create({ view }: HttpContextContract) {
    return await view.render('auth/login')
  }

  public async store({
    auth,
    session,
    request,
    response,
  }: HttpContextContract) {
    const { email, password, remember } = await request.validate(LoginValidator)

    try {
      await auth.use('web').verifyCredentials(email, password)
    } catch (error) {
      session.flash('error', 'Credenciales incorrectas')
      return response.redirect().back()
    }

    const user = await User.findBy('email', email)

    console.log(user)

    if (!user || !user.active) {
      session.flash('error', 'Usuario no encontrado')
      return response.redirect().back()
    }

    await auth.use('web').attempt(email, password, remember)

    return response.redirect().toRoute('home')
  }

  public async destroy({}: HttpContextContract) {}
}
