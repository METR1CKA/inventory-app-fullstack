import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import PackagingDetail from './PackagingDetail'
import Entry from './Entry'

export default class Unit extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public name: string

  // Relaciones
  @hasMany(() => Entry, {
    localKey: 'id',
    foreignKey: 'unit_package_id',
  })
  public entries: HasMany<typeof Entry>

  @hasMany(() => PackagingDetail, {
    localKey: 'id',
    foreignKey: 'unit_id',
  })
  public packaging_details: HasMany<typeof PackagingDetail>
}
