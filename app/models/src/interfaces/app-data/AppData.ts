import { ConfluenceAppData } from './ConfluenceAppData'
import { DriveAppData } from './DriveAppData'
import { GithubAppData } from './GithubAppData'
import { GmailAppData } from './GmailAppData'
import { JiraAppData } from './JiraAppData'
import { SlackAppData } from './SlackAppData'
import { WebsiteAppData } from './WebsiteAppData'

export * from './ConfluenceAppData'
export * from './DriveAppData'
export * from './GithubAppData'
export * from './GmailAppData'
export * from './JiraAppData'
export * from './SlackAppData'
export * from './WebsiteAppData'

export type AppData =
  | ConfluenceAppData
  | JiraAppData
  | DriveAppData
  | GmailAppData
  | GithubAppData
  | SlackAppData
  | WebsiteAppData
