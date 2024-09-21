import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import { DateTime } from 'luxon'
import User from './User'

export default class ApiToken extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        serializeAs: null,
    })
    public user_id: number

    @column()
    public name: string

    @column()
    public type: string

    @column()
    public token: string

    @column.dateTime({
        autoCreate: true,
        ...FormatDates.serializeDates(),
    })
    public expiresAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        ...FormatDates.serializeDates(),
    })
    public createdAt: DateTime

    // Relaciones
    @belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>
}
