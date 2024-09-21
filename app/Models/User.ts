import {
    column,
    beforeSave,
    BaseModel,
    hasMany,
    HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import Entry from './Entry'
import FormatDates from 'App/Services/FormatDates'

export default class User extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public email: string

    @column({
        serializeAs: null,
    })
    public password: string

    @column()
    public username: string

    @column()
    public active: boolean

    @column({
        serializeAs: null,
    })
    public rememberMeToken: string | null

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

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    // Relaciones
    @hasMany(() => Entry, {
        localKey: 'id',
        foreignKey: 'user_id',
    })
    public entries: HasMany<typeof Entry>
}
