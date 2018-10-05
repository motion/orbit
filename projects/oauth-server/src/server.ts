import OAuth from './oauth'
import OAuthStrategies from './oauthStrategies'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import Passport from 'passport'
import { OauthValues } from './oauthTypes'
import request from 'request'

const log = console.log.bind(console)

export class Server {
  cache = {}
  login = null
  app: express.Application

  oauth = new OAuth({
    strategies: OAuthStrategies,
    onSuccess: async (service, token, refreshToken, info) => {
      return { token, refreshToken, info, service }
    },
    findInfo: provider => {
      return this.cache[provider]
    },
    updateInfo: (provider, info) => {
      this.cache[provider] = info
    },
  })

  constructor() {
    const app = express()
    app.set('port', 443)
    app.use(morgan('dev'))

    this.app = app

    app.use(this.cors())

    // ROUTES
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.app.get('/hello', (_, res) => res.send('hello world'))

    // redirect latest app version to simple download link
    this.app.get('/download', async (_, res) => {
      let filename
      try {
        const latest = await fetch('http://get.tryorbit.com/updates/latest-mac.yml').then(x =>
          x.text(),
        )
        filename = latest.match(/(Orbit-.*-mac.zip)/g)[0]
      } catch (err) {
        console.log(err)
      }
      if (filename) {
        res.setHeader('content-disposition', 'attachment; filename=Orbit.zip')
        request(`http://get.tryorbit.com/updates/${filename}`).pipe(res)
      } else {
        res.status(500)
      }
    })

    this.setupPassportRoutes()
  }

  async start() {
    this.app.listen(443, () => {
      console.log('Oauth server listening', 443)
    })
  }

  cors() {
    const HEADER_ALLOWED =
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token, Access-Control-Allow-Headers'
    return (req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')
      next()
    }
  }

  setupPassportRoutes() {
    this.app.use(
      '/auth', // TODO change secret
      session({ secret: 'orbit', resave: false, saveUninitialized: true }),
    )
    this.app.use('/auth', Passport.initialize({ userProperty: 'currentUser' }))
    this.app.use('/auth', Passport.session({ pauseStream: false }))
    this.setupAuthRefreshRoutes()
    this.setupAuthReplyRoutes()
  }

  setupAuthRefreshRoutes() {
    this.app.use('/auth/refreshToken/:service', async (req, res) => {
      log.info('refresh for', req.params.service)
      try {
        const refreshToken = await this.oauth.refreshToken(req.params.service)
        res.json({ refreshToken })
      } catch (error) {
        log.info('error', error)
        res.status(500)
        res.json({ error })
      }
    })
  }

  setupAuthReplyRoutes() {
    for (const name in OAuthStrategies) {
      const path = `/auth/${name}`
      const strategy = OAuthStrategies[name]
      const options = strategy.options
      this.app.get(path, Passport.authenticate(name, options, null))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name, options, null),
        (req, res) => {
          const values: OauthValues = req.user || req['currentUser']
          res.send(`
<html>
  <head>
    <title>Finish Orbit Auth</title>
    <script>
      var url = "http://private.tryorbit.com/authCallback/${name}?value=${encodeURIComponent(
            JSON.stringify(values),
          )}&secret=${encodeURIComponent(
            strategy.config.credentials.clientSecret,
          )}&clientId=${encodeURIComponent(strategy.config.credentials.clientId)}"
      window.location = url
    </script>
    <style type="text/css">
      * { box-sizing: border-box; display: flex; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
        background: #fff;
        font-size: 16px;
        line-height: 1.5rem;
        font-weight: 300;
      }
    </style>
  </head>
  <body>
    <div style="flex: 1; align-items: center; justify-content: center;">
      <div style="width: 400px; padding: 20px; margin: auto;">
        <h2>All set!</h2>
        <p>
          Orbit will now start scanning this integration privately on your device. You can close this tab.
        </p>
      </div>
    </div>
  </body>
</html>
`)
        },
      )
    }
  }
}
