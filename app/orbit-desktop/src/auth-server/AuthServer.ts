import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import bodyParser from 'body-parser'
import killPort from 'clear-port'
import express from 'express'
import session from 'express-session'
import { Server } from 'https'
import morgan from 'morgan'
import Passport from 'passport'
import * as Path from 'path'

import { finishAuth } from './finishAuth'
import OAuth from './oauth'
import { OAuthStrategies } from './oauthStrategies'
import { OauthValues } from './oauthTypes'

const Config = getGlobalConfig()
const log = new Logger('auth-server')

/**
 * Runs https server that responses to oauth returned by Sources.
 */
export class AuthServer {
  private server: Server

  cache = {}
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

  isRunning(): boolean {
    return !!this.server
  }

  async start() {
    await killPort(Config.ports.auth)
    log.verbose('creating auth https server')
    this.setupExpressApp()
    this.app.listen(Config.ports.auth, () => {
      log.info('AuthServer listening', Config.ports.auth)
    })
  }

  async stop(): Promise<void> {
    if (!this.server) return

    log.verbose('stopping auth https server')
    await new Promise((ok, fail) => {
      this.server.close(err => (err ? fail(err) : ok()))
    })
    log.verbose('auth https server was stopped')
  }

  private setupExpressApp() {
    this.app = express()
    if (process.env.NODE_ENV !== 'development') {
      this.app.use(morgan('dev'))
    }
    this.app.use(this.cors())
    // fixes bug with 304 errors sometimes
    // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
    this.app.disable('etag')
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.app.get('/hello', (_, res) => res.send('hello world'))
    this.app.get('/authorize', (req, res) => {
      res.send(
        `<html><body>Authorized. Please click <a href="orbit://https://orbitauth.com${
          req.originalUrl
        }">this link</a></body></html>`,
      )
    })

    // // redirect latest app version to simple download link
    // this.app.get('/download', async (_, res) => {
    //   let filename
    //   try {
    //     const latest = await fetch('http://get.tryorbit.com/updates/latest-mac.yml').then(x =>
    //       x.text(),
    //     )
    //     filename = latest.match(/(Orbit-.*-mac.zip)/g)[0]
    //   } catch (err) {
    //     console.log(err)
    //   }
    //   if (filename) {
    //     res.setHeader('content-disposition', 'attachment; filename=Orbit.zip')
    //     request(`http://get.tryorbit.com/updates/${filename}`).pipe(res)
    //   } else {
    //     res.status(500)
    //   }
    // })

    this.setupPassportRoutes()

    this.app.use('/assets', express.static(Path.join(Config.paths.desktopRoot, 'assets')))
    this.app.get('/config', (_, res) => {
      const config = getGlobalConfig()
      log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })
  }

  private cors() {
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

  private setupPassportRoutes() {
    this.app.use(
      '/auth', // TODO change secret
      session({ secret: 'orbit', resave: false, saveUninitialized: true }),
    )
    this.app.use('/auth', Passport.initialize({ userProperty: 'currentUser' }))
    this.app.use('/auth', Passport.session({ pauseStream: false }))
    this.setupAuthRefreshRoutes()
    this.setupAuthReplyRoutes()
  }

  private setupAuthRefreshRoutes() {
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

  private setupAuthReplyRoutes() {
    for (const name in OAuthStrategies) {
      const path = `/auth/${name}`
      const strategy = OAuthStrategies[name]
      const options = strategy.options
      this.app.get(path, Passport.authenticate(name, options, null))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name, options, null),
        (req, res) => {
          const values: OauthValues = req['user'] || req['currentUser']
          finishAuth(name, values)
          res.send(`
<html>
  <head>
    <title>Orbit Auth Complete</title>
    <style>
      body * { box-sizing: border-box; display: flex; flex-flow: column; }
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
    <div style="height: 100%; width: 100%; align-items: center; justify-content: center;">
      <div style="width: 400px; padding: 20px; margin: auto;">
        <h2>All set!</h2>
        <p>
          Orbit will now start scanning this Source privately on your device. You can close this tab.
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
