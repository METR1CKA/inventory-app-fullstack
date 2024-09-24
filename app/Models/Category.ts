import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'

export default class Category extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        // serializeAs: null,
    })
    public main_category_id?: number | null

    @column()
    public name: string

    @column()
    public active: boolean

    // Relaciones
    @hasMany(() => Category, {
        localKey: 'id',
        foreignKey: 'main_category_id',
    })
    public subcategory: HasMany<typeof Category>

    @hasMany(() => Product, {
        localKey: 'id',
        foreignKey: 'category_id',
    })
    public products: HasMany<typeof Product>
}
