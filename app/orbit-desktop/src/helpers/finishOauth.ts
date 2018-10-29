import { getGlobalConfig } from '@mcro/config'
import { SettingEntity } from '@mcro/entities'
import {
  DriveSetting,
  GmailSetting,
  IntegrationType,
  Setting,
  SlackSetting,
  SlackSettingValues,
} from '@mcro/models'
import { DriveLoader, GMailLoader, SlackLoader } from '@mcro/services'
import { App, Desktop } from '@mcro/stores'
import { getRepository } from 'typeorm'
import { closeChromeTabWithUrlStarting } from '../helpers/injections'

const Config = getGlobalConfig()

type OauthValues = {
  token: string
  info: any
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
  console.log('OAUTH VALUES', values)
  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }

  // temporary fix
  if ((type as any) === 'gdrive') {
    type = 'drive'
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
  const setting: Setting = {
    target: 'setting',
    category: 'integration',
    identifier: type + (await getRepository(SettingEntity).count()), // adding count temporary to prevent unique constraint error
    type: type as any,
    token: values.token,
    values: {
      oauth: { ...values },
    } as any,
  }

  if (setting.type === 'slack') {
    const loader = new SlackLoader(setting as SlackSetting)
    const team = await loader.loadTeam()

    // update settings with team info
    const values = setting.values as SlackSettingValues
    values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    setting.name = team.name
  } else if (setting.type === 'github') {
    setting.name = values.info.username
  } else if (setting.type === 'drive') {
    // load account info
    const loader = new DriveLoader(setting as DriveSetting)
    const about = await loader.loadAbout()
    setting.name = about.user.emailAddress
  } else if (setting.type === 'gmail') {
    // load account info
    const loader = new GMailLoader(setting as GmailSetting)
    const profile = await loader.loadProfile()
    setting.name = profile.emailAddress
  }

  await getRepository(SettingEntity).save(setting)
}
