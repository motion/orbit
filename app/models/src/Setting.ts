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

export type GithubSetting = Setting & { values: GithubSettingValues }
export type SlackSetting = Setting & { values: SlackSettingValues }
export type AtlassianSetting = Setting & { values: AtlassianSettingValuesCredentials }
export type DriveSetting = Setting & { values: DriveSettingValues }
export type GmailSetting = Setting & { values: GmailSettingValues }
export type JiraSetting = Setting & { values: JiraSettingValues }
export type ConfluenceSetting = Setting & { values: ConfluenceSettingValues }
export type GeneralSetting = Setting & { values: GeneralSettingValues }
export type WebsiteSetting = Setting & { values: WebsiteSettingValues }
