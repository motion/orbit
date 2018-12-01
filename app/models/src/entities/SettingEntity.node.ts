import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Setting } from '../interfaces/Setting'

@Entity()
export class SettingEntity extends BaseEntity {
  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name?: string

  @Column('simple-json', { default: '{}' })
  values?: Setting['values']
}
