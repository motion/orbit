import Passport from 'passport'

export default class OAuth {
  passport = Passport

  constructor({ strategies, onSuccess }) {
    if (!strategies) {
      throw Error(`Need to provide strategies key`)
    }
    if (!onSuccess) {
      throw Error(`Need to provide onSuccess callback`)
    }

    for (const name of Object.keys(strategies)) {
      const { strategy: Strategy, config } = strategies[name]
      if (!config.credentials) {
        console.log('No credentials found for strategy', name)
        continue
      }
      Passport.use(
        new Strategy(config.credentials, async function(
          accessToken,
          refreshToken,
          profile,
          cb
        ) {
          try {
            const user = await onSuccess(
              name,
              accessToken,
              refreshToken,
              profile
            )
            cb(null, user)
          } catch (err) {
            cb(err)
          }
        })
      )
    }
  }
}
