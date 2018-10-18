import { IntegrationType } from './IntegrationType'
import { AtlassianSettingValuesCredentials } from './setting-values/AtlassianSettingValuesCredentials'
import { ConfluenceSettingValues } from './setting-values/ConfluenceSettingValues'
import { DriveSettingValues } from './setting-values/DriveSettingValues'
import { GeneralSettingValues } from './setting-values/GeneralSettingValues'
import { GithubSettingValues } from './setting-values/GithubSettingValues'
import { GmailSettingValues } from './setting-values/GmailSettingValues'
import { JiraSettingValues } from './setting-values/JiraSettingValues'
import { SettingValues } from './setting-values/SettingValues'
import { SlackSettingValues } from './setting-values/SlackSettingValues'
import { WebsiteSettingValues } from './setting-values/WebsiteSettingValues'

export interface Setting {
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
  type?: 'general' | IntegrationType
  token?: string
  values?: SettingValues
  createdAt?: Date
  updatedAt?: Date
}

export type GithubSetting = Setting & { type: 'github', values: GithubSettingValues }
export type SlackSetting = Setting & { type: 'slack', values: SlackSettingValues }
export type AtlassianSetting = Setting & { type: 'confluence'|'jira', values: AtlassianSettingValuesCredentials }
export type DriveSetting = Setting & { type: 'gdrive', values: DriveSettingValues }
export type GmailSetting = Setting & { type: 'gmail', values: GmailSettingValues }
export type JiraSetting = Setting & { type: 'jira', values: JiraSettingValues }
export type ConfluenceSetting = Setting & { type: 'confluence', values: ConfluenceSettingValues }
export type GeneralSetting = Setting & { type: 'general', values: GeneralSettingValues }
export type WebsiteSetting = Setting & { type: 'website', values: WebsiteSettingValues }
