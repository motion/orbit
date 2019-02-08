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
import { LocationEntity } from './LocationEntity.node'
import { PersonEntity } from './PersonEntity.node'
import { SourceEntity } from './SourceEntity.node'
import { SpaceEntity } from './SpaceEntity.node'
import { Bit } from '../interfaces/Bit'
import { IntegrationType } from '../interfaces/IntegrationType'
import { BitContentType } from '../interfaces/BitContentType'
import { BitData } from '../bit-data/BitData'
import { Person } from '../interfaces/Person'
import { Source } from '../interfaces/Source'
import { Space } from '../interfaces/Space'

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
  integration?: IntegrationType

  /**
   * Source id can be null only for pinned urls.
   */
  @Column({ nullable: true })
  sourceId?: number

  @Column({ nullable: true })
  authorId?: number

  @Index()
  @Column()
  title?: string

  @Column()
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

  @Column()
  bitCreatedAt?: number

  @Column()
  bitUpdatedAt?: number

  @Index()
  @CreateDateColumn()
  createdAt?: Date

  @Index()
  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => PersonEntity)
  author?: Person

  @ManyToMany(() => PersonEntity, person => person.bits)
  @JoinTable()
  people?: Person[]

  @ManyToOne(() => SourceEntity)
  source?: Source

  @ManyToOne(() => SpaceEntity)
  space?: Space

  peopleCount?: number
}
