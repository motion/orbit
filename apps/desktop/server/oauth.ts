import Passport from 'passport'
import Refresh from 'passport-oauth2-refresh'
import { Desktop, App } from '@mcro/stores'
import { Setting } from '@mcro/models'
import { SettingEntity } from '~/entities/SettingEntity'
import { API_URL } from '../constants'
import { closeChromeTabWithUrlStarting } from '../helpers/injections'
import { OauthValues } from './oauthTypes'

export default class Oauth {
  findInfo: Function
  updateInfo: Function

  constructor({ strategies, onSuccess, findInfo, updateInfo }) {
    if (!strategies) {
      throw Error(`Need to provide strategies key`)
    }
    if (!onSuccess) {
      throw Error(`Need to provide onSuccess callback`)
    }
    if (!findInfo) {
      throw Error(`Need to provide findInfo`)
    }
    if (!updateInfo) {
      throw Error(`Need to provide updateInfo`)
    }
    this.findInfo = findInfo
    this.updateInfo = updateInfo
    this.setupStrategies(strategies, onSuccess)
    this.setupSerialization()
  }

  setupStrategies(strategies, onSuccess) {
    for (const name of Object.keys(strategies)) {
      const { strategy: Strategy, config } = strategies[name]
      if (!config.credentials) {
        console.log('No credentials found for strategy', name)
        continue
      }

      const strategy = new Strategy(
        config.credentials,
        async (accessToken, refreshToken, profile, cb) => {
          try {
            const info = await onSuccess(
              name,
              accessToken,
              refreshToken,
              profile,
            )
            this.updateInfo(name, info)
            cb(null, info)
          } catch (err) {
            cb(err)
          }
        },
      )

      Passport.use(name, strategy)
      Refresh.use(strategy)
    }
  }

  refreshToken(service) {
    return new Promise(async (resolve, reject) => {
      const info = this.findInfo(service)
      if (!info || !info.refreshToken) {
        return reject('No refreshToken found')
      }
      Refresh.requestNewAccessToken(
        service,
        info.refreshToken,
        async (err, accessToken) => {
          if (err || !accessToken) {
            reject(err || 'No access token')
          }
          console.log('got access token', accessToken)
          resolve(accessToken)
        },
      )
    })
  }

  setupSerialization() {
    Passport.serializeUser(async (_, done) => {
      done(null, 'a@b.com')
    })

    Passport.deserializeUser(async (id, done) => {
      const info = await this.findInfo(id)
      done(null, info || {})
    })
  }

  finishOauth = (type: string, values: OauthValues) => {
    // close window
    closeChromeTabWithUrlStarting(`${API_URL}/auth/${type}`)
    // create setting
    this.createSetting(type, values)
    // show Orbit again
    Desktop.sendMessage(App, App.messages.TOGGLE_SETTINGS, type)
  }

  private createSetting = async (type: string, values: OauthValues) => {
    if (!values.token) {
      throw new Error(`No token returned ${JSON.stringify(values)}`)
    }
    // todo: have a resolver for identifiers based on integration
    const oauthid = (values.info && values.info.id) || 'none'
    const identifier = `${oauthid}-${type}`
    let setting: Setting
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
      oauth: { ...values },
    }
    await setting.save()
  }
}
