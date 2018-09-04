import { SettingValues } from './setting-values/SettingValues'

export interface Setting {
  /**
   * Target type.
   */
  target: 'setting'

  id: number
  identifier: string
  category: string
  type: string
  token: string
  values: SettingValues
  createdAt: Date
  updatedAt: Date
}
