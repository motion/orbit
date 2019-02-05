import { ConfluenceSourceValues } from '../source-values/ConfluenceSourceValues'
import { DriveSourceValues } from '../source-values/DriveSourceValues'
import { GithubSourceValues } from '../source-values/GithubSourceValues'
import { GmailSourceValues } from '../source-values/GmailSourceValues'
import { JiraSourceValues } from '../source-values/JiraSourceValues'
import { SlackSourceValues } from '../source-values/SlackSourceValues'
import { WebsiteSourceValues } from '../source-values/WebsiteSourceValues'
import { ConfluenceSourceData } from '../source-data/ConfluenceSourceData'
import { DriveSourceData } from '../source-data/DriveSourceData'
import { GithubSourceData } from '../source-data/GithubSourceData'
import { GmailSourceData } from '../source-data/GmailSourceData'
import { JiraSourceData } from '../source-data/JiraSourceData'
import { SlackSourceData } from '../source-data/SlackSourceData'
import { WebsiteSourceData } from '../source-data/WebsiteSourceData'
import { Space } from './Space'

export type BaseSource = {
  /**
   * Target type.
   */
  target: 'source'

  /**
   * Unique setting id.
   */
  id?: number

  /**
   * Spaces where source is stored.
   */
  spaces?: Space[]

  /**
   * Setting name.
   * For example for github it will user name, for slack nickname,
   * for gmail and gdocs email address.
   */
  name?: string
  identifier?: string
  category?: string
  token?: string
  createdAt?: Date
  updatedAt?: Date
}

export type GithubSource = BaseSource & { type?: 'github', values?: GithubSourceValues, data?: GithubSourceData }
export type SlackSource = BaseSource & { type?: 'slack', values?: SlackSourceValues, data?: SlackSourceData }
export type DriveSource = BaseSource & { type?: 'drive', values?: DriveSourceValues, data?: DriveSourceData }
export type GmailSource = BaseSource & { type?: 'gmail', values?: GmailSourceValues, data?: GmailSourceData }
export type JiraSource = BaseSource & { type?: 'jira', values?: JiraSourceValues, data?: JiraSourceData }
export type ConfluenceSource = BaseSource & { type?: 'confluence', values?: ConfluenceSourceValues, data?: ConfluenceSourceData }
export type AtlassianSource = JiraSource | ConfluenceSource
export type WebsiteSource = BaseSource & { type?: 'website', values?: WebsiteSourceValues, data?: WebsiteSourceData }

export type AllSources = {
  github: GithubSource
  slack: SlackSource
  gmail: GmailSource
  jira: JiraSource
  confluence: ConfluenceSource
  website: WebsiteSource
  drive: DriveSource
}

export type Source =
  | SlackSource
  | DriveSource
  | GmailSource
  | JiraSource
  | ConfluenceSource
  | WebsiteSource
  | GithubSource
