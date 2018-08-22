import {
  ConfluencePersonData,
  GmailBitData,
  IntegrationType,
  Person,
  PersonBit,
  Setting,
  SlackPersonData,
  JiraPersonData,
  PersonData
} from '@mcro/models'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { PersonBitEntity } from './PersonBitEntity'
import { SettingEntity } from './SettingEntity'

@Entity()
export class PersonEntity extends BaseEntity implements Person {

  target: 'person' = 'person'

  @PrimaryColumn()
  id: string

  @Column({ type: String })
  integration: IntegrationType

  @Column()
  integrationId: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  photo: string

  @Column()
  name: string

  @Column()
  settingId: number

  @Column({ type: 'simple-json', default: '{}' })
  data: PersonData

  @Column({ type: 'simple-json', default: '{}' })
  raw: any

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => SettingEntity)
  setting: Setting

  @ManyToOne(() => PersonBitEntity, person => person.people)
  personBit: PersonBit

  @Column({ nullable: true })
  webLink: string

  @Column({ nullable: true })
  desktopLink: string

}
