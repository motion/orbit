import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AppData } from '../interfaces/app-data/AppData'
import { AppIdentifier } from '../interfaces/AppBit'
import { ItemType } from '../interfaces/ItemType'
import { Space } from '../interfaces/Space'
import { SpaceEntity } from './SpaceEntity.node'

@Entity()
export class AppEntity extends BaseEntity {
  target: 'app' = 'app'

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  identifier?: AppIdentifier | string

  @Column({ default: '' })
  sourceIdentifier?: string

  @Column({ default: '' })
  token?: string

  @ManyToMany(() => SpaceEntity, space => space.apps)
  @JoinTable()
  spaces?: Space[]

  @ManyToOne(() => SpaceEntity, space => space.apps)
  space?: Space

  @Column({ nullable: false })
  spaceId?: number

  @Column()
  name?: string

  @Column({ default: '' })
  itemType?: ItemType

  @Column({ type: 'simple-json', default: '[]' })
  colors?: string[]

  @Column({ default: false })
  pinned?: boolean

  @Column('simple-json', { default: '{}' })
  data?: AppData

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
