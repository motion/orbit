import { Setting } from './setting'
import * as T from './typeorm'
import { Person } from './person'

@T.Entity()
export class Bit extends T.BaseEntity {

  // todo: probably using generated id is a bad idea for the following reasons:
  // 1. we already have unique columns that we can use as primary keys
  // 2. since this table (as well as Person) will be place of endless insertions id will get out of range quite quickly
  // todo: check usages and remove
  @T.PrimaryGeneratedColumn()
  id: number

  /**
   * Database record creation time.
   *
   * todo: find about usages
   */
  @T.Index()
  @T.CreateDateColumn()
  createdAt: Date

  /**
   * Database record updation time.
   *
   * todo: find about usages
   */
  @T.Index()
  @T.UpdateDateColumn()
  updatedAt: Date

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

  // todo: do we need an integration id ?

  /**
   * todo: find about usages
   */
  @T.Column({ unique: true })
  contentHash: string

  /**
   * todo: find about usages
   */
  @T.Index()
  @T.Column()
  title: string

  /**
   * Bit body.
   * Used to show complete content of the bit.
   */
  @T.Column()
  body: string

  @T.Index()
  @T.Column()
  type: string

  /**
   * Time when bit was created on its origin.
   *
   * todo: why its a string?
   */
  @T.Column()
  bitCreatedAt: string

  /**
   * Time when bit was created on its origin.
   *
   * todo: why its a string?
   */
  @T.Column()
  bitUpdatedAt: string

  /**
   * Url to this bit on its origin.
   *
   * todo: create webLink and desktopLink instead
   */
  @T.Column({ nullable: true })
  url: string

  /**
   * Related to this Bit people.
   */
  @T.ManyToMany(_ => Person)
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
   * Time in number when Bit source was created.
   *
   * Currently we use it in a Slack.
   * todo: try to use bitCreatedAt
   */
  @T.Column({ nullable: true })
  time: number

  /**
   * Channel id.
   * We need it to find slack messages in a single channel.
   *
   * Currently we use it in a Slack.
   *
   * todo: use location instead
   */
  @T.Column({ nullable: true })
  channel: string

  /**
   * Bit raw JSON data.
   *
   * todo: needs to be typed!
   */
  @T.Column('simple-json', { default: '{}' })
  data: SlackBitType | Object // todo: provide other union types

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  location: Location

}

// todo: finish
// todo: extract
export interface SlackBitType {

}