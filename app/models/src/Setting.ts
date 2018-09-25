import { SettingValues } from './setting-values/SettingValues'
import { GithubSettingValues } from './setting-values/GithubSettingValues'
import { SlackSettingValues } from './setting-values/SlackSettingValues'
import { GmailSettingValues } from './setting-values/GmailSettingValues'
import { GDriveSettingValues } from './setting-values/GDriveSettingValues'
import { AtlassianSettingValuesCredentials } from './setting-values/AtlassianSettingValuesCredentials'

export interface Setting {
  /**
   * Target type.
   */
  target: 'setting'

  id: number
  identifier: string
  category: string
  type: 'general' | 'slack' | 'jira' | 'confluence' | 'github' | 'gmail' | 'gdrive' | 'app1'
  token: string
  values: SettingValues
  createdAt: Date
  updatedAt: Date
}

export type GithubSetting = Setting & { values: GithubSettingValues }
export type SlackSetting = Setting & { values: SlackSettingValues }
export type AtlassianSetting = Setting & { values: AtlassianSettingValuesCredentials }
export type GDriveSetting = Setting & { values: GDriveSettingValues }
export type GmailSetting = Setting & { values: GmailSettingValues }
