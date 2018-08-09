import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Person, PersonBit, Setting, SlackPersonData, IntegrationType } from '@mcro/models'
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

  @Column()
  name: string

  @Column()
  settingId: number

  @Column({ type: 'simple-json', default: '{}' })
  data: SlackPersonData

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => SettingEntity)
  setting: Setting

  @ManyToOne(() => PersonBitEntity, person => person.people)
  personBit: PersonBit

}
