import { ConfluenceSourceData } from './ConfluenceSourceData'
import { WebsiteSourceData } from './WebsiteSourceData'
import { DriveSourceData } from './DriveSourceData'
import { GithubSourceData } from './GithubSourceData'
import { GmailSourceData } from './GmailSourceData'
import { JiraSourceData } from './JiraSourceData'
import { SlackSourceData } from './SlackSourceData'

export type SourceData =
  | ConfluenceSourceData
  | JiraSourceData
  | DriveSourceData
  | GmailSourceData
  | GithubSourceData
  | SlackSourceData
  | WebsiteSourceData
