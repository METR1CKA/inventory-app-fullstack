import {
    BaseModel,
    belongsTo,
    BelongsTo,
    column,
    HasMany,
    hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import { DateTime } from 'luxon'
import Entry from './Entry'

export default class Product extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public category_id: number

    @column()
    public name: string

    @column()
    public description: string

    @column()
    public stock: number

    @column()
    public active: boolean

    @column.dateTime({
        autoCreate: true,
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
    })
    public updatedAt: DateTime

    // Relaciones
    @belongsTo(() => Category, {
        localKey: 'id',
        foreignKey: 'category_id',
    })
    public category: BelongsTo<typeof Category>

    @hasMany(() => Entry, {
        localKey: 'id',
        foreignKey: 'product_id',
    })
    public entries: HasMany<typeof Entry>
}
