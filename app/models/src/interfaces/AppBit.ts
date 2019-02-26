import { ConfluenceAppData } from './app-data/ConfluenceAppData'
import { DriveAppData } from './app-data/DriveAppData'
import { GithubAppData } from './app-data/GithubAppData'
import { GmailAppData } from './app-data/GmailAppData'
import { JiraAppData } from './app-data/JiraAppData'
import { SlackAppData } from './app-data/SlackAppData'
import { WebsiteAppData } from './app-data/WebsiteAppData'
import { Space } from './Space'

// base

export interface BaseAppBit {
  target: 'app'

  id?: number

  appType: AppBitType

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
  appId?: string
}

type GenericAppBit = BaseAppBit & {
  data?: any
  appId?: string
}

export type GithubApp = BaseAppBit & {
  appId?: 'github'
  data?: GithubAppData
}
export type SlackApp = BaseAppBit & {
  appId?: 'slack'
  data?: SlackAppData
}
export type DriveApp = BaseAppBit & {
  appId?: 'drive'
  data?: DriveAppData
}
export type GmailApp = BaseAppBit & {
  appId?: 'gmail'
  data?: GmailAppData
}
export type JiraApp = BaseAppBit & {
  appId?: 'jira'
  data?: JiraAppData
}
export type ConfluenceApp = BaseAppBit & {
  appId?: 'confluence'
  data?: ConfluenceAppData
}
export type AtlassianApp = JiraApp | ConfluenceApp
export type WebsiteApp = BaseAppBit & {
  appId?: 'website'
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
  | GenericAppBit

// TODO this is dynamic now...
export type AppBitType =
  | 'slack'
  | 'gmail'
  | 'drive'
  | 'github'
  | 'jira'
  | 'confluence'
  | 'website'
  | 'pinned'
