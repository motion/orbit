import { Setting } from '@mcro/models'
import { settingsList } from '../settingsList'
import { AppConfig } from '@mcro/stores'

export const getSettingTitle = (setting: Setting) => {
  const config = settingsList.find(x => x.integration === setting.type)
  return config ? config.title : ''
}

export const settingToAppConfig = (setting: Setting): AppConfig => ({
  id: `${setting.id}`,
  type: 'setting',
  integration: setting.type,
  icon: setting.type,
  title: getSettingTitle(setting),
})
