import { Bit } from './bit'
import { Person } from './person'
import * as T from './typeorm'

@T.Entity()
export class PersonBit extends T.BaseEntity {

  /**
   * Person's email address.
   */
  @T.PrimaryColumn()
  email: string

  /**
   * Person's name.
   */
  @T.Column({ nullable: true })
  @T.Index()
  name: string

  /**
   * All known person names.
   */
  @T.Column("simple-array")
  @T.Index()
  allNames: string[]

  /**
   * Person's profile photo.
   */
  @T.Column({ nullable: true })
  photo: string

  /**
   * All known person photos.
   */
  @T.Column("simple-array", { nullable: true })
  @T.Index()
  allPhotos: string[]

  /**
   * Bits related to this Person.
   */
  @T.ManyToMany(() => Bit)
  @T.JoinTable()
  bits: Bit[]

  /**
   * People from integrations.
   */
  @T.OneToMany(() => Person, person => person.personBit)
  people: Person[]

}