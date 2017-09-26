import Passport from 'passport'
import Refresh from 'passport-oauth2-refresh'

export default class Oauth {
  constructor({ strategies, onSuccess, findUser, updateUser }) {
    if (!strategies) {
      throw Error(`Need to provide strategies key`)
    }
    if (!onSuccess) {
      throw Error(`Need to provide onSuccess callback`)
    }
    if (!findUser) {
      throw Error(`Need to provide findUser`)
    }
    if (!updateUser) {
      throw Error(`Need to provide updateUser`)
    }
    this.findUser = findUser
    this.updateUser = updateUser
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

      const strategy = new Strategy(config.credentials, async function(
        accessToken,
        refreshToken,
        profile,
        cb
      ) {
        try {
          const user = await onSuccess(name, accessToken, refreshToken, profile)
          cb(null, user)
        } catch (err) {
          cb(err)
        }
      })

      Passport.use(strategy)
      Refresh.use(strategy)
    }
  }

  refreshToken(userId, service) {
    return new Promise(async (resolve, reject) => {
      const user = await this.findUser(userId)
      Refresh.requestNewAccessToken(
        service,
        user.refreshToken,
        async (err, accessToken) => {
          if (err || !accessToken) {
            reject(err || 'No access token')
          }
          console.log('got access token', accessToken)
          // await this.updateUser(accessToken)
          resolve(accessToken)
        }
      )
    })
  }

  setupSerialization() {
    Passport.serializeUser(async (user, done) => {
      await this.updateUser(user)
      done(null, null)
    })

    Passport.deserializeUser(async (id, done) => {
      const info = await this.findUser()
      done(null, info)
    })
  }
}
