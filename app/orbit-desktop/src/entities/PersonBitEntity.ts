import { Bit, Person, PersonBit } from '@mcro/models'
import { AfterLoad, BaseEntity, Column, Entity, getRepository, Index, OneToMany, PrimaryColumn } from 'typeorm'
import { BitEntity } from './BitEntity'
import { PersonEntity } from './PersonEntity'

@Entity()
export class PersonBitEntity extends BaseEntity implements PersonBit {

  target: 'person-bit' = 'person-bit'
  bits: Bit[]

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

  @Column({ default: false })
  hasSlack: boolean

  @Column({ default: false })
  hasGithub: boolean

  @Column({ default: false })
  hasGdrive: boolean

  @Column({ default: false })
  hasJira: boolean

  @Column({ default: false })
  hasConfluence: boolean

  @Column({ default: false })
  hasGmail: boolean

  @OneToMany(() => PersonEntity, person => person.personBit)
  people: Person[]

  @AfterLoad()
  async afterLoad() {
    this.bits = await getRepository(BitEntity)
      .createQueryBuilder("bit")
      .innerJoin("bit.people", "bitPerson")
      .innerJoin("bitPerson.personBit", "personBit", "personBit.email = :email")
      .setParameters({ email: this.email })
      .getMany()
  }

}
