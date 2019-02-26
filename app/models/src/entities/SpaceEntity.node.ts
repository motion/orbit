import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AppBit } from '../interfaces/AppBit'
import { Space } from '../interfaces/Space'
import { AppEntity } from './AppEntity.node'

@Entity()
export class SpaceEntity implements Space {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'simple-json' })
  colors: string[]

  @Column({ type: 'simple-json' })
  paneSort: number[]

  @OneToMany(() => AppEntity, app => app.space)
  apps: AppBit[]
}
