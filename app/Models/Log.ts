import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import { DateTime } from 'luxon'

export default class Log extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public level: string

    @column()
    public message: string

    @column()
    public meta?: { [key: string]: any }

    @column.dateTime({
        autoCreate: true,
        ...FormatDates.serializeDates(),
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        ...FormatDates.serializeDates(),
    })
    public updatedAt: DateTime
}
