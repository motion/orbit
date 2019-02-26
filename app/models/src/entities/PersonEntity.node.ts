import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Bit } from '../interfaces/Bit'
import { Person } from '../interfaces/Person'
import { PersonBit } from '../interfaces/PersonBit'
import { Source } from '../interfaces/Source'
import { SourceType } from '../interfaces/SourceType'
import { PersonData } from '../person-data/PersonData'
import { BitEntity } from './BitEntity.node'
import { PersonBitEntity } from './PersonBitEntity.node'
import { SourceEntity } from './SourceEntity.node'

@Entity()
export class PersonEntity extends BaseEntity implements Person {
  target: 'person' = 'person'

  @PrimaryColumn()
  id?: number

  @Column({ unique: true })
  contentHash?: number

  @Column({ type: String })
  sourceType?: SourceType

  @Column()
  userId?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  photo?: string

  @Column()
  name?: string

  @Column()
  sourceId?: number

  @Column({ type: 'simple-json', default: '{}' })
  data?: PersonData

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => SourceEntity)
  source?: Source

  @ManyToOne(() => PersonBitEntity, person => person.people)
  personBit?: PersonBit

  @ManyToMany(() => BitEntity, bit => bit.people)
  bits?: Bit[]
}
