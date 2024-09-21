import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
    public async index({ view }: HttpContextContract) {
        const categories = await Category.all()
        return view.render('inventory/category', { categories })
    }

    public async create({}: HttpContextContract) {}

    public async store({}: HttpContextContract) {}

    public async show({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
