import {
  Bit,
  IntegrationType,
  Person,
  PersonBit,
  PersonData,
  Setting,
} from '@mcro/models'
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
import { BitEntity } from './BitEntity'
import { PersonBitEntity } from './PersonBitEntity'
import { SettingEntity } from './SettingEntity'

@Entity()
export class PersonEntity extends BaseEntity implements Person {

  target: 'person' = 'person'

  @PrimaryColumn()
  id?: number

  @Column({ unique: true })
  contentHash?: number

  @Column({ type: String })
  integration?: IntegrationType

  @Column()
  integrationId?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  photo?: string

  @Column()
  name?: string

  @Column()
  settingId?: number

  @Column({ type: 'simple-json', default: '{}' })
  data?: PersonData

  @Column({ type: 'simple-json', default: '{}' })
  raw?: any

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => SettingEntity)
  setting?: Setting

  @ManyToOne(() => PersonBitEntity, person => person.people)
  personBit?: PersonBit

  @ManyToMany(() => BitEntity, bit => bit.people)
  bits?: Bit[]

}
