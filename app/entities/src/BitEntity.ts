import { Bit, BitData, IntegrationType, Person, Source } from '@mcro/models'
import { BitContentType } from '@mcro/models'
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
import { LocationEntity } from './LocationEntity'
import { PersonEntity } from './PersonEntity'
import { SourceEntity } from './SourceEntity'

@Entity()
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

  @Column({ type: 'simple-json', default: '{}' })
  raw?: any

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
}
