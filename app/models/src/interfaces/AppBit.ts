import { ConfluenceAppData } from './app-data/ConfluenceAppData'
import { DriveAppData } from './app-data/DriveAppData'
import { GithubAppData } from './app-data/GithubAppData'
import { GmailAppData } from './app-data/GmailAppData'
import { JiraAppData } from './app-data/JiraAppData'
import { SlackAppData } from './app-data/SlackAppData'
import { WebsiteAppData } from './app-data/WebsiteAppData'
import { ItemType } from './ItemType'
import { Space } from './Space'

// base

export interface BaseAppBit {
  target: 'app'

  id?: number

  itemType?: ItemType

  identifier?: AppIdentifier | string

  // For validating if we're re-adding the same source
  sourceIdentifier?: string

  space?: Space

  spaceId?: number

  /**
   * Spaces where app is stored.
   */
  spaces?: Space[]

  name?: string

  pinned?: boolean

  colors?: string[]

  editable?: boolean

  createdAt?: Date

  updatedAt?: Date

  token?: string

  data?: any
}

export type GithubApp = BaseAppBit & {
  identifier?: 'github'
  data?: GithubAppData
}
export type SlackApp = BaseAppBit & {
  identifier?: 'slack'
  data?: SlackAppData
}
export type DriveApp = BaseAppBit & {
  identifier?: 'drive'
  data?: DriveAppData
}
export type GmailApp = BaseAppBit & {
  identifier?: 'gmail'
  data?: GmailAppData
}
export type JiraApp = BaseAppBit & {
  identifier?: 'jira'
  data?: JiraAppData
}
export type ConfluenceApp = BaseAppBit & {
  identifier?: 'confluence'
  data?: ConfluenceAppData
}
export type AtlassianApp = JiraApp | ConfluenceApp
export type WebsiteApp = BaseAppBit & {
  identifier?: 'website'
  data?: WebsiteAppData
}

export type AllApps = {
  github: GithubApp
  slack: SlackApp
  gmail: GmailApp
  jira: JiraApp
  confluence: ConfluenceApp
  website: WebsiteApp
  drive: DriveApp
}

export type AppBit =
  | SlackApp
  | DriveApp
  | GmailApp
  | JiraApp
  | ConfluenceApp
  | WebsiteApp
  | GithubApp
  | BaseAppBit

export type AppIdentifier =
  | 'slack'
  | 'gmail'
  | 'drive'
  | 'github'
  | 'jira'
  | 'confluence'
  | 'website'
  | 'pinned'
