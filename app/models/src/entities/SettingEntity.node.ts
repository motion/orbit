import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { Setting } from '../interfaces/Setting'

@Entity()
export class SettingEntity extends BaseEntity implements Setting {
  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name?: string

  @Column({ type: 'simple-json', default: '{}' })
  value?: Setting['value']
}
