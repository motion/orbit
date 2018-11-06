import { ConfluenceSourceValues } from './source-values/ConfluenceSourceValues'
import { DriveSourceValues } from './source-values/DriveSourceValues'
import { GithubSourceValues } from './source-values/GithubSourceValues'
import { GmailSourceValues } from './source-values/GmailSourceValues'
import { JiraSourceValues } from './source-values/JiraSourceValues'
import { SlackSourceValues } from './source-values/SlackSourceValues'
import { WebsiteSourceValues } from './source-values/WebsiteSourceValues'
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
   * Space where source is stored.
   */
  space?: Space

  /**
   * Id of the space where source is stored.
   */
  spaceId?: number

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

export type GithubSource = BaseSource & { type?: 'github', values?: GithubSourceValues }
export type SlackSource = BaseSource & { type?: 'slack', values?: SlackSourceValues }
export type DriveSource = BaseSource & { type?: 'drive', values?: DriveSourceValues }
export type GmailSource = BaseSource & { type?: 'gmail', values?: GmailSourceValues }
export type JiraSource = BaseSource & { type?: 'jira', values?: JiraSourceValues }
export type ConfluenceSource = BaseSource & {
  type?: 'confluence'
  values?: ConfluenceSourceValues
}
export type AtlassianSource = JiraSource | ConfluenceSource
export type WebsiteSource = BaseSource & { type?: 'website', values?: WebsiteSourceValues }

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
