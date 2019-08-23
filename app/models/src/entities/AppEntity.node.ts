import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { AppBit } from '../AppBit'
import { ItemType } from '../ItemType'
import { Space } from '../SpaceInterface'
import { SpaceEntity } from './SpaceEntity.node'

@Entity()
export class AppEntity extends BaseEntity implements AppBit {
  target: 'app' = 'app'

  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: String })
  identifier?: string

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

  @Column()
  icon?: string

  @Column({ default: '' })
  itemType?: ItemType

  @Column({ type: 'simple-json', default: '[]' })
  colors?: string[]

  @Column({ type: 'varchar', default: 'plain' })
  tabDisplay?: AppBit['tabDisplay']

  @Column({ default: true })
  editable?: boolean

  @Column('simple-json', { default: '{}' })
  data?: any

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
