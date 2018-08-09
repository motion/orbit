import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { Bit, Person, PersonBit } from '@mcro/models'
import { BitEntity } from './BitEntity'
import { PersonEntity } from './PersonEntity'

@Entity()
export class PersonBitEntity extends BaseEntity implements PersonBit {

  target: 'person-bit' = 'person-bit'

  @PrimaryColumn()
  email: string

  @Column({ nullable: true })
  @Index()
  name: string

  @Column({ type: 'simple-array', default: '[]' })
  @Index()
  allNames: string[]

  @Column({ nullable: true })
  photo: string

  @Column({ type: 'simple-array', default: '[]' })
  @Index()
  allPhotos: string[]

  @ManyToMany(() => BitEntity)
  @JoinTable()
  bits: Bit[]

  @OneToMany(() => PersonEntity, person => person.personBit)
  people: Person[]

}
