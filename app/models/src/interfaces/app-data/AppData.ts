import { ConfluenceAppData } from './ConfluenceAppData'
import { DriveAppData } from './DriveAppData'
import { GithubAppData } from './GithubAppData'
import { GmailAppData } from './GmailAppData'
import { JiraAppData } from './JiraAppData'
import { SlackAppData } from './SlackAppData'
import { WebsiteAppData } from './WebsiteAppData'

export type AppData =
  | ConfluenceAppData
  | JiraAppData
  | DriveAppData
  | GmailAppData
  | GithubAppData
  | SlackAppData
  | WebsiteAppData
