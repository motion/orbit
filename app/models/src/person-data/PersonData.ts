import { ConfluencePersonData } from './ConfluencePersonData'
import { DrivePersonData } from './DrivePersonData'
import { GithubPersonData } from './GithubPersonData'
import { GmailPersonData } from './GmailPersonData'
import { JiraPersonData } from './JiraPersonData'
import { SlackPersonData } from './SlackPersonData'

/**
 * What Person.data property can be.
 */
export type PersonData =
  | ConfluencePersonData
  | GithubPersonData
  | GmailPersonData
  | JiraPersonData
  | SlackPersonData
  | DrivePersonData
