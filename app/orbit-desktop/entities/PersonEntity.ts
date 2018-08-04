import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Person, PersonBit, Setting } from '@mcro/models'
import { PersonBitEntity } from './PersonBitEntity'
import { SettingEntity } from './SettingEntity'

@Entity()
export class PersonEntity extends BaseEntity implements Person {

  target = "person"

  // todo: probably using generated id is a bad idea for the following reasons:
  // 1. we already have unique columns that we can use as primary keys
  // 2. since this table (as well as Bit) will be place of endless insertions id will get out of range quite quickly
  // todo: check usages and remove
  @PrimaryGeneratedColumn()
  id: number

  /**
   * Person id.
   *
   * todo: rename to "id" if we remove auto generated key
   */
  @Column({ unique: true })
  identifier: string

  /**
   * Integration type.
   * Duplicates information stored in the settings.
   */
  @Column({ type: String, nullable: true })
  integration: "slack"|string // todo: need to specify all possible integration types here

  /**
   * Id of this person in the integration that owns it.
   */
  @Column({ nullable: true })
  integrationId: string

  /**
   * Database record creation time.
   *
   * todo: find about usages
   */
  @CreateDateColumn()
  createdAt: Date

  /**
   * Database record updation time.
   *
   * todo: find about usages
   */
  @UpdateDateColumn()
  updatedAt: Date

  /**
   * Name of this person in the integration that owns it.
   */
  @Column()
  name: string

  /**
   * Setting has multiple persons it owns.
   * Setting is a Person's owner.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @ManyToOne(() => SettingEntity)
  setting: Setting

  /**
   * Setting id.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @Column({ nullable: true })
  settingId: number

  /**
   * Person data crawled from the API.
   */
  @Column('simple-json', { default: '{}' })
  data: SlackPersonData // todo: write down all other data types from other integrations

  /**
   * People bits from integrations.
   */
  @ManyToOne(() => PersonBitEntity, person => person.people)
  personBit: PersonBit

}

// todo: extract out of here later
export interface SlackPersonData {
  name: string
  email: string
  phone: string
  profile?: {
    image_48?: string
  }
}