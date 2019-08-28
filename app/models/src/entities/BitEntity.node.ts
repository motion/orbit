import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'

import { AppBit } from '../AppBit'
import { Bit } from '../Bit'
import { BitContentType } from '../BitContentType'
import { Space } from '../SpaceInterface'
import { AppEntity } from './AppEntity.node'
import { LocationEntity } from './LocationEntity.node'
import { SpaceEntity } from './SpaceEntity.node'

@Entity()
@Index('searchIndex1', { synchronize: false })
@Index('searchIndex2', { synchronize: false })
@Index('searchIndex3', { synchronize: false })
@Index('searchIndex4', { synchronize: false })
export class BitEntity extends BaseEntity implements Bit {
  target: 'bit' = 'bit'

  @PrimaryColumn()
  id?: number

  @Index()
  @Column({ unique: true })
  contentHash?: number

  @Column({ type: String })
  appIdentifier?: string

  /**
   * Source id can be null only for pinned urls.
   */
  @Column({ nullable: true })
  appId?: number

  @Column({ nullable: true })
  authorId?: number

  @Column({ nullable: true })
  originalId?: string

  @Index()
  @Column({ default: 'Untitled' })
  title?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  photo?: string

  @Column({ nullable: true })
  body?: string

  @Index()
  @Column({ default: '' })
  type?: BitContentType

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

  @Column({ type: 'simple-json', default: '{}' })
  data?: any

  @Column(() => LocationEntity)
  location?: LocationEntity

  @Index()
  @Column({ nullable: true })
  bitCreatedAt?: number

  @Index()
  @Column({ nullable: true })
  bitUpdatedAt?: number

  @Column({ default: false })
  crawled?: boolean

  @Index()
  @CreateDateColumn()
  createdAt?: Date

  @Index()
  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => BitEntity)
  author?: Bit

  @ManyToMany(() => BitEntity, bit => bit.bits)
  @JoinTable()
  people?: Bit[]

  @ManyToMany(() => BitEntity, bit => bit.people)
  bits?: Bit[]

  @ManyToOne(() => AppEntity)
  app?: AppBit

  @ManyToOne(() => SpaceEntity)
  space?: Space

  @Column({ nullable: true })
  spaceId?: number

  @Column({ nullable: true })
  icon?: string
}
