import Passport from 'passport'
import Refresh from 'passport-oauth2-refresh'

export default class Oauth {
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
              profile
            )
            this.updateInfo(name, info)
            cb(null, info)
          } catch (err) {
            cb(err)
          }
        }
      )

      Passport.use(strategy)
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
        }
      )
    })
  }

  setupSerialization() {
    Passport.serializeUser(async (user, done) => {
      done(null, 'a@b.com')
    })

    Passport.deserializeUser(async (id, done) => {
      const info = await this.findInfo(id)
      done(null, info)
    })
  }
}
