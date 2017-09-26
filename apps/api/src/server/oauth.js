import Passport from 'passport'
import Refresh from 'passport-oauth2-refresh'

export default class Oauth {
  cache = {}

  constructor({ strategies, onSuccess }) {
    if (!strategies) {
      throw Error(`Need to provide strategies key`)
    }
    if (!onSuccess) {
      throw Error(`Need to provide onSuccess callback`)
    }
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
    return new Promise((resolve, reject) => {
      Refresh.requestNewAccessToken(
        service,
        this.cache[userId].refreshToken,
        (err, accessToken) => {
          if (err || !accessToken) {
            reject(err || 'No access token')
          }
          resolve(accessToken)
        }
      )
    })
  }

  setupSerialization() {
    Passport.serializeUser((user, done) => {
      const id = user.info.id
      this.cache[id] = user.info
      done(null, id)
    })

    Passport.deserializeUser((id, done) => {
      done(null, this.cache[id])
    })
  }
}
