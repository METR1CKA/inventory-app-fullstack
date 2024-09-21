import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    return await view.render('home')
  }

  public async show({ view }: HttpContextContract) {
    return await view.render('welcome')
  }
}
