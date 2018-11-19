import { BitData } from './bit-data/BitData'
import { IntegrationType } from './IntegrationType'
import { Location } from './Location'
import { Person } from './Person'
import { Source } from './Source'
import { BitContentType } from './BitContentType'
import { Space } from './Space'

export interface Bit {
  /**
   * Target type.
   */
  target: 'bit'

  /**
   * Bit id.
   */
  id?: number

  /**
   * Integration type.
   * Duplicates information stored in the settings.
   */
  integration?: IntegrationType

  /**
   * Source id.
   */
  sourceId?: number

  /**
   * Space id.
   */
  spaceId?: number

  /**
   * Original bit content author id.
   */
  authorId?: number

  /**
   * Bit unique content hash.
   */
  contentHash?: number

  /**
   * Database record creation time.
   */
  createdAt?: Date

  /**
   * Database record updation time.
   */
  updatedAt?: Date

  /**
   * Bit title.
   */
  title?: string

  /**
   * Bit format-less body.
   * Primary used for search.
   */
  body?: string

  /**
   * Content type, for example "conversation", "message", "email", etc.
   */
  type?: BitContentType

  /**
   * Time when bit was created on its origin.
   */
  bitCreatedAt?: number

  /**
   * Time when bit was updated on its origin.
   */
  bitUpdatedAt?: number

  /**
   * Web link to this bit on its origin.
   */
  webLink?: string

  /**
   * Desktop link to this bit on its origin.
   */
  desktopLink?: string

  /**
   * Original bit content author.
   */
  author?: Person

  /**
   * Related to this Bit people.
   */
  people?: Person[]

  /**
   * Source is a Bit's owner.
   */
  source?: Source

  /**
   * Space is owner of this bit's source.
   */
  space?: Space

  /**
   * Additional bit data.
   */
  data?: BitData

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  location?: Location
}
