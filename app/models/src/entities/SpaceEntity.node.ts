import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { AppBit } from '../AppBit'
import { Space } from '../SpaceInterface'
import { AppEntity } from './AppEntity.node'

@Entity()
export class SpaceEntity extends BaseEntity implements Space {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name?: string

  @Column()
  identifier?: string

  @Column()
  directory?: string

  @Column({ default: false })
  onboarded?: boolean

  @Column({ type: 'simple-json' })
  colors?: string[]

  @Column({ type: 'simple-json', default: '[]' })
  paneSort?: number[]

  @OneToMany(() => AppEntity, app => app.space)
  apps?: AppBit[]
}
