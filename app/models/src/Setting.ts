import { IntegrationType } from './IntegrationType'
import { AtlassianSettingValuesCredentials } from './setting-values/AtlassianSettingValuesCredentials'
import { ConfluenceSettingValues } from './setting-values/ConfluenceSettingValues'
import { DriveSettingValues } from './setting-values/DriveSettingValues'
import { GeneralSettingValues } from './setting-values/GeneralSettingValues'
import { GithubSettingValues } from './setting-values/GithubSettingValues'
import { GmailSettingValues } from './setting-values/GmailSettingValues'
import { JiraSettingValues } from './setting-values/JiraSettingValues'
import { SlackSettingValues } from './setting-values/SlackSettingValues'
import { WebsiteSettingValues } from './setting-values/WebsiteSettingValues'

export type BaseSetting = {
  /**
   * Target type.
   */
  target: 'setting'

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

export type GithubSetting = BaseSetting & { type?: 'github'; values?: GithubSettingValues }
export type SlackSetting = BaseSetting & { type?: 'slack'; values?: SlackSettingValues }
export type AtlassianSetting = BaseSetting & {
  type: 'confluence' | 'jira'
  values: AtlassianSettingValuesCredentials
}
export type DriveSetting = BaseSetting & { type?: 'drive'; values?: DriveSettingValues }
export type GmailSetting = BaseSetting & { type?: 'gmail'; values?: GmailSettingValues }
export type JiraSetting = BaseSetting & { type?: 'jira'; values?: JiraSettingValues }
export type ConfluenceSetting = BaseSetting & { type?: 'confluence'; values?: ConfluenceSettingValues }
export type GeneralSetting = BaseSetting & { type?: 'general'; values?: GeneralSettingValues }
export type WebsiteSetting = BaseSetting & { type?: 'website'; values?: WebsiteSettingValues }

export type AllSettings = {
  github: GithubSetting
  slack: SlackSetting
  gmail: GmailSetting
  jira: JiraSetting
  confluence: ConfluenceSetting
  website: WebsiteSetting
  drive: DriveSetting
}

export type Setting = GeneralSetting
  | SlackSetting
  | DriveSetting
  | GmailSetting
  | JiraSetting
  | ConfluenceSetting
  | WebsiteSetting
  | GithubSetting

export type IntegrationSetting<A extends IntegrationType> = AllSettings[A]
