import { ensure, react, store } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { certificateFor } from '@mcro/devcert'
import { Logger } from '@mcro/logger'
import { App, Desktop } from '@mcro/stores'
import * as https from 'https'
import express from 'express'
import { Server } from 'https'
import * as Path from "path"
import { finishOauth } from '../helpers/finishOauth'
import OAuth from './oauth'
import OAuthStrategies from './oauthStrategies'
import morgan from 'morgan'
import request from 'request'
import bodyParser from 'body-parser'
import session from 'express-session'
import Passport from 'passport'
import killPort from 'kill-port'
import { OauthValues } from './oauthTypes'
import proxy from 'http-proxy-middleware'

const Config = getGlobalConfig()

/**
 * Runs https server that responses to oauth returned by integrations.
 */
export class HttpsAuthServer {
  private server: Server
  private log: Logger

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

  constructor() {
    this.log = new Logger('https-server')
  }

  /**
   * Checks if server is running.
   */
  isRunning(): boolean {
    return !!this.server
  }

  /**
   * Starts HTTPS auth server.
   */
  async start(): Promise<void> {

    // if server is already running, ignore
    if (this.server) return

    // todo: extract those options into configuration

    this.log.verbose('creating certificate')
    const ssl = await certificateFor(Config.urls.authHost)

    this.log.verbose('creating auth https server')
    this.setupExpressApp()
    this.server = await new Promise<Server>(async (ok, fail) => {

      // kill old processes
      this.log.verbose(`Killing old server on ${Config.ports.auth}...`)
      await killPort(Config.ports.auth)

      const server = https.createServer(ssl, this.app).listen(Config.ports.auth, err => {
        if (err) return fail(err)
        ok(server)
      })
    })
    this.log.verbose('auth https server was created')
  }

  /**
   * Stops running HTTPS auth server.
   */
  async stop(): Promise<void> {
    if (!this.server)
      return

    this.log.verbose('stopping auth https server')
    await new Promise((ok, fail) => {
      this.server.close(err => err ? fail(err) : ok())
    })
    this.log.verbose('auth https server was stopped')
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

    this.app.use('/assets', express.static(Path.join(Config.paths.desktopRoot, 'assets')))
    this.app.get('/config', (_, res) => {
      const config = getGlobalConfig()
      this.log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
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
      this.log.info('refresh for', req.params.service)
      try {
        const refreshToken = await this.oauth.refreshToken(req.params.service)
        res.json({ refreshToken })
      } catch (error) {
        this.log.info('error', error)
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
          const values: OauthValues = req.user || req['currentUser']
          const value = encodeURIComponent(JSON.stringify(values))
          const secret = encodeURIComponent(strategy.config.credentials.clientSecret)
          const clientId = encodeURIComponent(strategy.config.credentials.clientID)
          res.send(`
<html>
  <head>
    <title>...</title>
    <script>
      window.location = "${Config.urls.server}/authCallback/${name}?value=${value}&secret=${secret}&clientId=${clientId}"
    </script>
  </head>
  <body>
    passing to private proxy...
  </body>
</html>
`)
        },
      )
    }
  }


}
