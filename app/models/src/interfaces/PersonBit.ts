import { Person } from './Person'
import { SourceTypeValues } from './SourceType'

export interface PersonBit {
  /**
   * Target type.
   */
  target: 'person-bit'

  /**
   * Unique person id.
   */
  id?: number

  /**
   * Unique person email address.
   */
  email?: string

  /**
   * Person's name.
   */
  name?: string

  /**
   * All known person names.
   */
  allNames?: SourceTypeValues

  /**
   * Person's profile photo.
   */
  photo?: string

  /**
   * All known person photos.
   */
  allPhotos?: SourceTypeValues

  /**
   * People from Sources.
   */
  people?: Person[]

  /**
   * Indicates if person has Sources with Slack.
   */
  hasSlack?: boolean

  /**
   * Indicates if person has Sources with Github.
   */
  hasGithub?: boolean

  /**
   * Indicates if person has Sources with Drive.
   */
  hasDrive?: boolean

  /**
   * Indicates if person has Sources with Jira.
   */
  hasJira?: boolean

  /**
   * Indicates if person has Sources with Confluence.
   */
  hasConfluence?: boolean

  /**
   * Indicates if person has Sources with Gmail.
   */
  hasGmail?: boolean
}
