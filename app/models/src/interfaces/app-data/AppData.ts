import { ConfluenceAppData } from './ConfluenceAppData'
import { DriveAppData } from './DriveAppData'
import { GithubAppData } from './GithubAppData'
import { GmailAppData } from './GmailAppData'
import { JiraAppData } from './JiraAppData'
import { SlackAppData } from './SlackAppData'
import { WebsiteAppData } from './WebsiteAppData'

export { ConfluenceAppData } from './ConfluenceAppData'
export { DriveAppData } from './DriveAppData'
export { GithubAppData } from './GithubAppData'
export { GmailAppData } from './GmailAppData'
export { JiraAppData } from './JiraAppData'
export { SlackAppData } from './SlackAppData'
export { WebsiteAppData } from './WebsiteAppData'

export type AppData =
  | ConfluenceAppData
  | JiraAppData
  | DriveAppData
  | GmailAppData
  | GithubAppData
  | SlackAppData
  | WebsiteAppData
