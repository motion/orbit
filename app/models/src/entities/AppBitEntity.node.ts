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
import { AppBitType } from '../interfaces/AppBit'
import { Space } from '../interfaces/Space'
import { SpaceEntity } from './SpaceEntity.node'

@Entity()
export class AppBitEntity extends BaseEntity {
  target: 'app' = 'app'

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  appId?: string

  @Column()
  appType?: AppBitType

  @ManyToMany(() => SpaceEntity, space => space.apps)
  @JoinTable()
  spaces?: Space[]

  @ManyToOne(() => SpaceEntity, space => space.apps)
  space?: Space

  @Column({ nullable: false })
  spaceId?: number

  @Column()
  name?: string

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
