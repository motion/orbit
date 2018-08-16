import { GmailBitData } from './bit-data/GmailBitData'
import { SlackBitData } from './bit-data/SlackBitData'
import { Location } from './Location'
import { Person } from './Person'
import { Setting } from './Setting'
import { IntegrationType } from './IntegrationType'

export interface Bit {

  /**
   * Target type.
   */
  target: "bit"

  /**
   * Bit id.
   */
  id: string

  /**
   * Integration type.
   * Duplicates information stored in the settings.
   */
  integration: IntegrationType

  /**
   * Database record creation time.
   */
  createdAt: Date

  /**
   * Database record updation time.
   */
  updatedAt: Date

  /**
   * Bit title.
   */
  title: string

  /**
   * Bit format-less body.
   * Primary used for search.
   */
  body: string

  /**
   * Content type, for example "conversation", "message", "email", etc.
   */
  type: string

  /**
   * Time when bit was created on its origin.
   */
  bitCreatedAt: number

  /**
   * Time when bit was updated on its origin.
   */
  bitUpdatedAt: number

  /**
   * Web link to this bit on its origin.
   */
  webLink: string

  /**
   * Desktop link to this bit on its origin.
   */
  desktopLink: string

  /**
   * Related to this Bit people.
   */
  people: Person[]

  /**
   * Setting has multiple bits it owns.
   * Setting is a Bit's owner.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  setting: Setting

  /**
   * Setting id.
   *
   * todo: remove nullable once we migrate all syncers into new model
   */
  settingId: number

  /**
   * Additional bit data.
   */
  data: SlackBitData | GmailBitData | Object // todo: provide other union types

  /**
   * Raw JSON data.
   * Used to debugging purpose current, don't use this property, use "data" property instead.
   */
  raw: any

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  location: Location

  /**
   * todo: find about usages
   */
  contentHash: string

}