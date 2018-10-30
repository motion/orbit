import { IntegrationType } from './IntegrationType'
import { AtlassianSettingValuesCredentials } from './source-values/AtlassianSourceValuesCredentials'
import { ConfluenceSourceValues } from './source-values/ConfluenceSourceValues'
import { DriveSourceValues } from './source-values/DriveSourceValues'
import { GithubSourceValues } from './source-values/GithubSourceValues'
import { GmailSourceValues } from './source-values/GmailSourceValues'
import { JiraSourceValues } from './source-values/JiraSourceValues'
import { SlackSourceValues } from './source-values/SlackSourceValues'
import { WebsiteSourceValues } from './source-values/WebsiteSourceValues'

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

export type GithubSource = BaseSource & { type?: 'github'; values?: GithubSourceValues }
export type SlackSource = BaseSource & { type?: 'slack'; values?: SlackSourceValues }
export type AtlassianSource = BaseSource & {
  type: 'confluence' | 'jira'
  values: AtlassianSettingValuesCredentials
}
export type DriveSource = BaseSource & { type?: 'drive'; values?: DriveSourceValues }
export type GmailSource = BaseSource & { type?: 'gmail'; values?: GmailSourceValues }
export type JiraSource = BaseSource & { type?: 'jira'; values?: JiraSourceValues }
export type ConfluenceSource = BaseSource & {
  type?: 'confluence'
  values?: ConfluenceSourceValues
}
export type WebsiteSource = BaseSource & { type?: 'website'; values?: WebsiteSourceValues }

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

export type SourceOf<A extends IntegrationType> = AllSources[A]
