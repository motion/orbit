import { Bit, SlackBitDataType } from '@mcro/models'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { hash } from '~/helpers/createOrUpdateBit'
import { LocationEntity } from './LocationEntity'
import { PersonEntity } from './PersonEntity'
import { SettingEntity } from './SettingEntity'

@Entity()
export class BitEntity extends BaseEntity implements Bit {

  target = "bit"

  // todo: probably using generated id is a bad idea for the following reasons:
  // 1. we already have unique columns that we can use as primary keys
  // 2. since this table (as well as Person) will be place of endless insertions id will get out of range quite quickly
  // todo: check usages and remove
  /**
   * @deprecated
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * Url to this bit on its origin.
   *
   * todo: use webLink and desktopLink instead
   * @deprecated
   */
  @Column({ nullable: true })
  url: string

  /**
   * Bit id.
   *
   * todo: rename to "id" if we remove auto generated key
   */
  @Column({ unique: true })
  identifier: string

  /**
   * Integration type.
   * Duplicates information stored in the settings.
   */
  @Column({ type: String })
  integration: "slack"|string // todo: need to specify all possible integration types here

  /**
   * Database record creation time.
   */
  @Index()
  @CreateDateColumn()
  createdAt: Date

  /**
   * Database record updation time.
   */
  @Index()
  @UpdateDateColumn()
  updatedAt: Date

  /**
   * Bit title.
   */
  @Index()
  @Column()
  title: string

  /**
   * Bit body.
   * Primary used for search.
   */
  @Column()
  body: string

  /**
   * Content type, for example "conversation", "message", "email", etc.
   */
  @Index()
  @Column()
  type: string

  /**
   * Time when bit was created on its origin.
   */
  @Column()
  bitCreatedAt: number

  /**
   * Time when bit was updated on its origin.
   */
  @Column()
  bitUpdatedAt: number

  /**
   * Web link to this bit on its origin.
   */
  @Column({ nullable: true })
  webLink: string

  /**
   * Desktop link to this bit on its origin.
   */
  @Column({ nullable: true })
  desktopLink: string

  /**
   * Related to this Bit people.
   */
  @ManyToMany(() => PersonEntity)
  @JoinTable()
  people: PersonEntity[]

  /**
   * Setting has multiple bits it owns.
   * Setting is a Bit's owner.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @ManyToOne(() => SettingEntity)
  setting: SettingEntity

  /**
   * Setting id.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @Column({ nullable: true })
  settingId: number

  /**
   * Bit raw JSON data.
   */
  @Column('simple-json', { default: '{}' })
  data: SlackBitDataType | Object // todo: provide other union types

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  @Column(() => LocationEntity)
  location: LocationEntity

  /**
   * todo: find about usages
   */
  @Column({ unique: true })
  contentHash: string

  @BeforeUpdate()
  @BeforeInsert()
  beforeInsert() {
    if (!this.contentHash)
      this.contentHash = hash(this.data)
  }

}