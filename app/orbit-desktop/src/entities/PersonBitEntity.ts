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
  // @ts-ignore
  target = 'person-bit'

  /**
   * Person's email address.
   */
  @PrimaryColumn() email: string

  /**
   * Person's name.
   */
  @Column({ nullable: true })
  @Index()
  name: string

  /**
   * All known person names.
   */
  @Column('simple-array')
  @Index()
  allNames: string[]

  /**
   * Person's profile photo.
   */
  @Column({ nullable: true })
  photo: string

  /**
   * All known person photos.
   */
  @Column('simple-array', { nullable: true })
  @Index()
  allPhotos: string[]

  /**
   * Bits related to this Person.
   */
  @ManyToMany(() => BitEntity)
  @JoinTable()
  bits: Bit[]

  /**
   * People from integrations.
   */
  @OneToMany(() => PersonEntity, person => person.personBit)
  people: Person[]
}
