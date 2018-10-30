import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Source } from '@mcro/models'

@Entity()
export class SettingEntity extends BaseEntity {
  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id?: number

  @Column('simple-json', { default: '{}' })
  values?: Source['values']
}
