import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { AppBit } from '../interfaces/AppBit'
import { Space } from '../interfaces/SpaceInterface'
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

  @Column({ type: 'simple-json' })
  colors?: string[]

  @Column({ type: 'simple-json' })
  paneSort?: number[]

  @OneToMany(() => AppEntity, app => app.space)
  apps?: AppBit[]
}
