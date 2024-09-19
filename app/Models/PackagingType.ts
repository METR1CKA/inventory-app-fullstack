import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import PackagingDetail from './PackagingDetail'

export default class PackagingType extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public name: string

  // Relaciones
  @hasMany(() => PackagingDetail, {
    localKey: 'id',
    foreignKey: 'packaging_type_id',
  })
  public packaging_details: HasMany<typeof PackagingDetail>
}
