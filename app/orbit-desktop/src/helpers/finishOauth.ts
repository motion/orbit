import { Setting } from '@mcro/models'
import { IntegrationType } from '@mcro/models'
import { Desktop, App } from '@mcro/stores'
import { SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
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

export const finishOauth = (type: IntegrationType, values: OauthValues) => {
  // close window
  closeChromeTabWithUrlStarting(`${Config.urls.server}/auth/${type}`)
  // create setting
  createSetting(type, values)
  // show Orbit again
  Desktop.sendMessage(App, App.messages.SHOW_APPS, type)
}

const createSetting = async (type: IntegrationType, values: OauthValues) => {
  console.log("OAUTH VALUES", values)
  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }
  // todo: have a resolver for identifiers based on integration
  // const oauthid = (values.info && values.info.id) || 'none'
  // const identifier = `${oauthid}-${type}`
  // let setting
  // // update if its the same identifier from the oauth
  // if (identifier) {
  //   setting = await getRepository(SettingEntity).findOne({ identifier })
  // }
  // if (!setting) {
  //   setting = new SettingEntity()
  // }
  const setting = {
    category: 'integration',
    identifier: type + await getRepository(SettingEntity).count(), // adding count temporary to prevent unique constraint error
    type: type,
    token: values.token,
    values: {
      oauth: { ...values },
    }
  }
  await getRepository(SettingEntity).save(setting)
}
