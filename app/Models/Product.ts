import {
    BaseModel,
    beforeSave,
    belongsTo,
    BelongsTo,
    column,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import { DateTime } from 'luxon'
import FormatDates from 'App/Services/FormatDates'

export default class Product extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        serializeAs: null,
    })
    public category_id: number

    @column()
    public name: string

    @column()
    public description: string

    @column()
    public stock: number

    @column()
    public sku: string

    @column()
    public active: boolean

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

    // Relaciones
    @belongsTo(() => Category, {
        localKey: 'id',
        foreignKey: 'category_id',
    })
    public category: BelongsTo<typeof Category>

    @beforeSave()
    public static async generateSKU(product: Product) {
        product.sku = `PROD-${
            product.sku
                ? product.sku.toUpperCase()
                : Math.random().toString(36).substring(2, 15).toUpperCase()
        }`
    }
}
