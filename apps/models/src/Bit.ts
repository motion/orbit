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
   * @deprecated
   */
  id: number

  /**
   * @deprecated
   */
  url: string

  /**
   * Bit id.
   */
  identifier: string

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
   * Bit body.
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
   * Bit raw JSON data.
   */
  data: SlackBitDataType | Object // todo: provide other union types

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  location: Location

  /**
   * todo: find about usages
   */
  contentHash: string

}

// todo: finish
// todo: extract
export interface SlackBitDataType {

}