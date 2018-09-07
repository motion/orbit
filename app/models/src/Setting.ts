import { SettingValues } from './setting-values/SettingValues'

export interface Setting {
  /**
   * Target type.
   */
  target: 'setting'

  id: number
  identifier: string
  category: string
  type:
    | 'general'
    | 'slack'
    | 'jira'
    | 'confluence'
    | 'github'
    | 'gmail'
    | 'gdrive'
  token: string
  values: SettingValues
  createdAt: Date
  updatedAt: Date
}
