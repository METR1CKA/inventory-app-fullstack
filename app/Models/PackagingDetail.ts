import {
    BaseModel,
    belongsTo,
    BelongsTo,
    column,
    HasMany,
    hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import PackagingType from './PackagingType'
import { DateTime } from 'luxon'
import Entry from './Entry'
import Unit from './Unit'

export default class PackagingDetail extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        serializeAs: null,
    })
    public packaging_type_id: number

    @column({
        serializeAs: null,
    })
    public unit_id: number

    @column()
    public unit_quantity: number

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
    @belongsTo(() => PackagingType, {
        localKey: 'id',
        foreignKey: 'packaging_type_id',
    })
    public packaging_type: BelongsTo<typeof PackagingType>

    @belongsTo(() => Unit, {
        localKey: 'id',
        foreignKey: 'unit_id',
    })
    public unit: BelongsTo<typeof Unit>

    @hasMany(() => Entry, {
        localKey: 'id',
        foreignKey: 'packaging_detail_id',
    })
    public entries: HasMany<typeof Entry>
}
