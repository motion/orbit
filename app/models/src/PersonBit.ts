import { IntegrationTypeValues } from './IntegrationType'
import { Person } from './Person'

export interface PersonBit {
  /**
   * Target type.
   */
  target: 'person-bit'

  /**
   * Person's email address.
   */
  email: string

  /**
   * Person's name.
   */
  name: string

  /**
   * All known person names.
   */
  allNames: IntegrationTypeValues

  /**
   * Person's profile photo.
   */
  photo: string

  /**
   * All known person photos.
   */
  allPhotos: IntegrationTypeValues

  /**
   * People from integrations.
   */
  people: Person[]

  /**
   * Indicates if person has integrations with Slack.
   */
  hasSlack: boolean

  /**
   * Indicates if person has integrations with Github.
   */
  hasGithub: boolean

  /**
   * Indicates if person has integrations with Gdrive.
   */
  hasGdrive: boolean

  /**
   * Indicates if person has integrations with Jira.
   */
  hasJira: boolean

  /**
   * Indicates if person has integrations with Confluence.
   */
  hasConfluence: boolean

  /**
   * Indicates if person has integrations with Gmail.
   */
  hasGmail: boolean
}
