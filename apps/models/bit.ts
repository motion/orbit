import { hash } from './helpers/createOrUpdateBit'
import { Setting } from './setting'
import * as T from './typeorm'
import { Person } from './person'
import { Location } from './location'

@T.Entity()
export class Bit extends T.BaseEntity {

  // todo: probably using generated id is a bad idea for the following reasons:
  // 1. we already have unique columns that we can use as primary keys
  // 2. since this table (as well as Person) will be place of endless insertions id will get out of range quite quickly
  // todo: check usages and remove
  /**
   * @deprecated
   */
  @T.PrimaryGeneratedColumn()
  id: number

  /**
   * Url to this bit on its origin.
   *
   * todo: use webLink and desktopLink instead
   * @deprecated
   */
  @T.Column({ nullable: true })
  url: string

  /**
   * Bit id.
   *
   * todo: rename to "id" if we remove auto generated key
   */
  @T.Column({ unique: true })
  identifier: string

  /**
   * Integration type.
   * Duplicates information stored in the settings.
   */
  @T.Column({ type: String })
  integration: "slack"|string // todo: need to specify all possible integration types here

  /**
   * Database record creation time.
   */
  @T.Index()
  @T.CreateDateColumn()
  createdAt: Date

  /**
   * Database record updation time.
   */
  @T.Index()
  @T.UpdateDateColumn()
  updatedAt: Date

  /**
   * Bit title.
   */
  @T.Index()
  @T.Column()
  title: string

  /**
   * Bit body.
   * Primary used for search.
   */
  @T.Column()
  body: string

  /**
   * Content type, for example "conversation", "message", "email", etc.
   */
  @T.Index()
  @T.Column()
  type: string

  /**
   * Time when bit was created on its origin.
   */
  @T.Column()
  bitCreatedAt: string

  /**
   * Time when bit was created on its origin.
   */
  @T.Column()
  bitUpdatedAt: string

  /**
   * Web link to this bit on its origin.
   */
  @T.Column({ nullable: true })
  webLink: string

  /**
   * Desktop link to this bit on its origin.
   */
  @T.Column({ nullable: true })
  desktopLink: string

  /**
   * Related to this Bit people.
   */
  @T.ManyToMany(() => Person)
  @T.JoinTable()
  people: Person[]

  /**
   * Setting has multiple bits it owns.
   * Setting is a Bit's owner.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @T.ManyToOne(() => Setting)
  setting: Setting

  /**
   * Setting id.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  @T.Column({ nullable: true })
  settingId: number

  /**
   * Bit raw JSON data.
   */
  @T.Column('simple-json', { default: '{}' })
  data: SlackBitDataType | Object // todo: provide other union types

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  @T.Column(() => Location)
  location: Location

  /**
   * todo: find about usages
   */
  @T.Column({ unique: true })
  contentHash: string

  /**
   * Time in number when Bit source was created.
   * We can't use bitCreatedAt because its a string.
   * Currently we use it in a Slack.
   */
  @T.Column({ nullable: true })
  time: number

  @T.BeforeUpdate()
  @T.BeforeInsert()
  beforeInsert() {
    if (!this.contentHash)
      this.contentHash = hash(this.data)
  }

}

// todo: finish
// todo: extract
export interface SlackBitDataType {

}