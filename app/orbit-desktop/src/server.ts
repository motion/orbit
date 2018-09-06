import 'isomorphic-fetch'
import morgan from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import { getGlobalConfig } from '@mcro/config'
import killPort from 'kill-port'
import { logger } from '@mcro/logger'
import { finishOauth } from './helpers/finishOauth'

const log = logger('desktop')
const Config = getGlobalConfig()

export default class Server {
  cache = {}
  login = null
  app: express.Application

  constructor() {
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

    this.setupOauthCallback()
    this.app.get('/hello', (_, res) => res.send('hello world'))

    // config
    this.app.get('/config', (_, res) => {
      const config = getGlobalConfig()
      log(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })

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

  private cors() {
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

  private setupOrbitApp() {
    // proxy to webpack-dev-server in development
    if (process.env.NODE_ENV === 'development') {
      log('Serving orbit app through proxy to webpack-dev-server...')
      const webpackUrl = 'http://localhost:3999'
      const router = {
        [`http://localhost:${Config.ports.server}`]: webpackUrl,
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

  private setupOauthCallback() {
    log('Setting up authCallback route')
    this.app.get('/authCallback/:service', (req, res) => {
      const value = JSON.parse(decodeURIComponent(req.query.value))
      log('got auth value', value)
      finishOauth(req.params.service, value)
      res.send(
        '<html><head><title>Authentication Success</title><script>window.close()</script></head><body>All done, closing...</body></html>',
      )
    })
  }
}
