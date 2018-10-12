import { IntegrationType } from './IntegrationType'
import { WebsiteSettingValues } from './setting-values/WebsiteSettingValues'
import { SettingValues } from './setting-values/SettingValues'
import { GithubSettingValues } from './setting-values/GithubSettingValues'
import { SlackSettingValues } from './setting-values/SlackSettingValues'
import { GmailSettingValues } from './setting-values/GmailSettingValues'
import { DriveSettingValues } from './setting-values/DriveSettingValues'
import { AtlassianSettingValuesCredentials } from './setting-values/AtlassianSettingValuesCredentials'
import { GeneralSettingValues } from './setting-values/GeneralSettingValues'

export interface Setting {
  /**
   * Target type.
   */
  target: 'setting'

  id?: number
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
export type GeneralSetting = Setting & { values: GeneralSettingValues }
export type WebsiteSetting = Setting & { values: WebsiteSettingValues }
