import { BitData } from '../bit-data/BitData'
import { BitContentType } from './BitContentType'
import { Location } from './Location'
import { Source } from './Source'
import { SourceType } from './SourceType'

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
   * Source type.
   */
  sourceType?: SourceType

  /**
   * Source id.
   */
  sourceId?: number

  /**
   * Original bit content author id.
   */
  authorId?: number

  /**
   * Id of the content on a remote.
   */
  originalId?: string

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
   * Bit email (used for person bits).
   */
  email?: string

  /**
   * Bit photo (used for person bits).
   */
  photo?: string

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
  author?: Bit

  /**
   * Related to this Bit people.
   */
  people?: Bit[]

  /**
   * Bits this person owns (used when bit type is person).
   */
  bits?: Bit[]

  /**
   * Related to this Bit number of people.
   */
  peopleCount?: number

  /**
   * Source is a Bit's owner.
   */
  source?: Source

  /**
   * Additional bit data.
   */
  data?: BitData

  /**
   * Used for filtering: slack room, github repo, google doc folder, etc
   */
  location?: Location

  /**
   * Used for website bits.
   * Indicates if website was already crawled.
   * If it was already crawled, crawler skips crawling this bit.
   * We store it on entity-level to improve selection performance for crawler.
   */
  crawled?: boolean
}
