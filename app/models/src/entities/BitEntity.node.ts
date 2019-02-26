import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BitData } from '../bit-data/BitData'
import { Bit } from '../interfaces/Bit'
import { BitContentType } from '../interfaces/BitContentType'
import { Source } from '../interfaces/Source'
import { SourceType } from '../interfaces/SourceType'
import { Space } from '../interfaces/Space'
import { LocationEntity } from './LocationEntity.node'
import { SourceEntity } from './SourceEntity.node'
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
  sourceType?: SourceType

  /**
   * Source id can be null only for pinned urls.
   */
  @Column({ nullable: true })
  sourceId?: number

  @Column({ nullable: true })
  authorId?: number

  @Column({ nullable: true })
  originalId?: string

  @Index()
  @Column()
  title?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  photo?: string

  @Column({ nullable: true })
  body?: string

  @Index()
  @Column()
  type?: BitContentType

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

  @Column({ type: 'simple-json', default: '{}' })
  data?: BitData

  @Column(() => LocationEntity)
  location?: LocationEntity

  @Column({ nullable: true })
  bitCreatedAt?: number

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

  @ManyToOne(() => SourceEntity)
  source?: Source

  @ManyToOne(() => SpaceEntity)
  space?: Space

  peopleCount?: number
}
