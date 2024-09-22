import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormatDates from 'App/Services/FormatDates'
import Entry from 'App/Models/Entry'

export default class EntriesController {
    private entries = Entry.query()
        .preload('packaging_detail')
        .preload('product')
        .preload('unit')
        .preload('user')
        .orderBy('id', 'desc')

    public async index({ view }: HttpContextContract) {
        const entries = await this.entries
        // return response.ok(entries[0])
        return await view.render('inventory/entry', {
            entries,
            format: FormatDates.serializeDates().serialize,
        })
    }

    public async store({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}
}
