import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm'
import { PersonEntity } from './PersonEntity.node'
import { IntegrationTypeValues } from '../interfaces/IntegrationType'
import { Person } from '../interfaces/Person'
import { PersonBit } from '../interfaces/PersonBit'

@Entity()
export class PersonBitEntity extends BaseEntity implements PersonBit {
  target: 'person-bit' = 'person-bit'

  @PrimaryColumn()
  id?: number

  @Column({ unique: true })
  email?: string

  @Column({ nullable: true })
  @Index()
  name?: string

  @Column({ type: 'simple-json', default: '{}' })
  @Index()
  allNames?: IntegrationTypeValues

  @Column({ nullable: true })
  photo?: string

  @Column({ type: 'simple-json', default: '{}' })
  @Index()
  allPhotos?: IntegrationTypeValues

  @Column({ default: false })
  hasSlack?: boolean

  @Column({ default: false })
  hasGithub?: boolean

  @Column({ default: false })
  hasDrive?: boolean

  @Column({ default: false })
  hasJira?: boolean

  @Column({ default: false })
  hasConfluence?: boolean

  @Column({ default: false })
  hasGmail?: boolean

  @OneToMany(() => PersonEntity, person => person.personBit)
  people?: Person[]
}
