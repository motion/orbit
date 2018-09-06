import { Desktop, App } from '@mcro/stores'
import { SettingEntity } from '../entities/SettingEntity'
import { closeChromeTabWithUrlStarting } from '../helpers/injections'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()

type OauthValues = {
  token: string
  info: {
    id: string
  }
  error?: string
  refreshToken?: string
}

export const finishOauth = (type: string, values: OauthValues) => {
  // close window
  closeChromeTabWithUrlStarting(`${Config.urls.server}/auth/${type}`)
  // create setting
  createSetting(type, values)
  // show Orbit again
  Desktop.sendMessage(App, App.messages.SHOW_APPS, type)
}

const createSetting = async (type: string, values: OauthValues) => {
  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }
  // todo: have a resolver for identifiers based on integration
  const oauthid = (values.info && values.info.id) || 'none'
  const identifier = `${oauthid}-${type}`
  let setting
  // update if its the same identifier from the oauth
  if (identifier) {
    setting = await SettingEntity.findOne({ identifier })
  }
  if (!setting) {
    setting = new SettingEntity()
  }
  setting.category = 'integration'
  setting.identifier = identifier
  setting.type = type
  setting.token = values.token
  setting.values = {
    ...setting.values,
    oauth: { ...values }, // todo
  }
  await setting.save()
}
