import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import PackagingDetail from './PackagingDetail'
import { DateTime } from 'luxon'
import Product from './Product'
import User from './User'
import Unit from './Unit'

export default class Entry extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        serializeAs: null,
    })
    public product_id: number

    @column({
        serializeAs: null,
    })
    public packaging_detail_id: number

    @column({
        serializeAs: null,
    })
    public user_id: number

    @column({
        serializeAs: null,
    })
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
    @belongsTo(() => Product, {
        localKey: 'id',
        foreignKey: 'product_id',
        onQuery: (query) => query.preload('category'),
    })
    public product: BelongsTo<typeof Product>

    @belongsTo(() => PackagingDetail, {
        localKey: 'id',
        foreignKey: 'packaging_detail_id',
        onQuery: (query) => query.preload('packaging_type').preload('unit'),
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
    public unit_package: BelongsTo<typeof Unit>
}
