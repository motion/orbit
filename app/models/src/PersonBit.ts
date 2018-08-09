import { Bit } from './Bit'
import { Person } from './Person'

export interface PersonBit {

  /**
   * Target type.
   */
  target: "person-bit"

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
  allNames: string[]

  /**
   * Person's profile photo.
   */
  photo: string

  /**
   * All known person photos.
   */
  allPhotos: string[]

  /**
   * Bits related to this Person.
   */
  bits: Bit[]

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