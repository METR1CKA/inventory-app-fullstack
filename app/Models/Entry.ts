import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Product from './Product'
import PackagingDetail from './PackagingDetail'
import User from './User'
import Unit from './Unit'

export default class Entry extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public product_id: number

    @column()
    public packaging_detail_id: number

    @column()
    public user_id: number

    @column()
    public unit_package_id: number

    @column()
    public quantity_packages: number

    @column()
    public weight_packages: number

    @column()
    public quantity_weight: number

    @column()
    public packages_total: number

    @column()
    public product_total: number

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
    @belongsTo(() => Product, {
        localKey: 'id',
        foreignKey: 'product_id',
    })
    public product: BelongsTo<typeof Product>

    @belongsTo(() => PackagingDetail, {
        localKey: 'id',
        foreignKey: 'packaging_detail_id',
    })
    public packaging_detail: BelongsTo<typeof PackagingDetail>

    @belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>

    @belongsTo(() => Unit, {
        localKey: 'id',
        foreignKey: 'unit_package_id',
    })
    public unit: BelongsTo<typeof Unit>
}
