import 'isomorphic-fetch'
import morgan from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import session from 'express-session'
import bodyParser from 'body-parser'
import { getGlobalConfig } from '@mcro/config'
import OAuth from './server/oauth'
import OAuthStrategies from '@mcro/oauth-strategies'
import Passport from 'passport'
import killPort from 'kill-port'
import { logger } from '@mcro/logger'

const log = logger('desktop')
const Config = getGlobalConfig()

export default class Server {
  oauth: OAuth
  cache = {}
  login = null
  app: express.Application

  constructor() {
    this.oauth = new OAuth({
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

    const app = express()
    app.set('port', Config.ports.server)

    // if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('dev'))
    // }

    this.app = app

    app.use(this.cors())

    // ROUTES
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

    this.app.get('/hello', (_, res) => res.send('hello world'))

    // config
    this.app.get('/config', (_, res) => {
      const config = getGlobalConfig()
      log(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })

    this.setupCredPass()
    this.setupPassportRoutes()
    this.setupOrbitApp()
  }

  async start() {
    // kill old processes
    log('Killing any old servers...')
    await killPort(Config.ports.server)
    log('Desktop listening!!!!!!!!!...')
    this.app.listen(Config.ports.server, () => {
      console.log('listening at port', Config.ports.server)
    })

    return Config.ports.server
  }

  cors() {
    const HEADER_ALLOWED =
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token, Access-Control-Allow-Headers'
    return (req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,POST,PUT,DELETE,OPTIONS',
      )
      next()
    }
  }

  creds = {}
  setupCredPass() {
    this.app.use('/getCreds', (_, res) => {
      if (Object.keys(this.creds).length) {
        res.json(this.creds)
      } else {
        res.json({ error: 'no creds' })
      }
    })
    this.app.use('/setCreds', (req, res) => {
      log('setCreds', typeof req.body, req.body)
      if (req.body) {
        this.creds = req.body
      }
      res.sendStatus(200)
    })
  }

  verifySession = async (username, token) => {
    const user = await this.login.getUser(username)
    if (!user) {
      return false
    }
    const session = user.session[token]
    if (!session) {
      return false
    }
    if (typeof session.expires !== 'number') {
      log('non-number session')
      return false
    }
    return session.expires > Date.now()
  }

  setupOrbitApp() {
    // proxy to webpack-dev-server in development
    if (process.env.NODE_ENV === 'development') {
      log('Serving orbit app through proxy to webpack-dev-server...')
      const webpackUrl = 'http://localhost:3002'
      const router = {
        'http://localhost:3001': webpackUrl,
      }
      this.app.use(
        '/',
        proxy({
          target: webpackUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          logLevel: 'warn',
          router,
        }),
      )
    }
    // serve static in production
    if (process.env.NODE_ENV !== 'development') {
      log(`Serving orbit static app in ${Config.paths.appStatic}...`)
      this.app.use('/', express.static(Config.paths.appStatic))
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
      log('refresh for', req.params.service)
      try {
        const refreshToken = await this.oauth.refreshToken(req.params.service)
        res.json({ refreshToken })
      } catch (error) {
        log('error', error)
        res.status(500)
        res.json({ error })
      }
    })
  }

  setupAuthReplyRoutes() {
    for (const name in OAuthStrategies) {
      const path = `/auth/${name}`
      const options = OAuthStrategies[name].options
      this.app.get(path, Passport.authenticate(name, options, null))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name, options, null),
        (req, res) => {
          const values = req.user || req['currentUser']
          this.oauth.finishOauth(name, values)
          res.send(
            '<html><head><title>Authentication Success</title></head><body>All done, closing...</body></html>',
          )
        },
      )
    }
  }
}
