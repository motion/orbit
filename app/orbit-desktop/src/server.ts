import 'isomorphic-fetch'
import morgan from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import { getGlobalConfig } from '@mcro/config'
import killPort from 'kill-port'
import { Logger } from '@mcro/logger'
import { finishOauth } from './helpers/finishOauth'
import * as Path from 'path'

const log = new Logger('desktop')
const Config = getGlobalConfig()

export class Server {
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
      log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })

    this.setupOrbitApp()
  }

  async start() {
    // kill old processes
    log.verbose('Killing any old servers...')
    await killPort(Config.ports.server)
    this.app.listen(Config.ports.server, () => {
      log.info('listening at port', Config.ports.server)
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
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')
      next()
    }
  }

  private setupOrbitApp() {
    // proxy to webpack-dev-server in development
    if (process.env.NODE_ENV === 'development') {
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
      log.info(`Serving orbit static app in ${Config.paths.appStatic}...`)
      this.app.use(express.static(Config.paths.appStatic))
      this.app.use((_, res) => res.sendFile(Path.join(Config.paths.appStatic, 'index.html')))
    }
  }

  private setupOauthCallback() {
    this.app.get('/authCallback/:service', (req, res) => {
      const secret = decodeURIComponent(req.query.secret)
      const clientId = decodeURIComponent(req.query.clientId)
      const values = {
        ...JSON.parse(decodeURIComponent(req.query.value)),
        secret,
        clientId,
      }
      log.info('got auth value', values)
      finishOauth(req.params.service, values)
      res.send(
        '<html><head><title>Authentication Success</title><script>window.close()</script></head><body>All done, closing...</body></html>',
      )
    })
  }
}
