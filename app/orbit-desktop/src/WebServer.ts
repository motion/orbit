import 'isomorphic-fetch'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import { getGlobalConfig } from '@mcro/config'
import killPort from 'kill-port'
import { Logger } from '@mcro/logger'
import * as Path from 'path'

const log = new Logger('desktop')
const Config = getGlobalConfig()

export class WebServer {
  cache = {}
  login = null
  app: express.Application

  constructor() {
    const app = express()
    app.set('port', Config.ports.server)

    this.app = app

    app.use(this.cors())
    // fixes bug with 304 errors sometimes
    // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
    app.disable('etag')

    // ROUTES
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

    this.setupOauthCallback()
    this.app.get('/hello', (_, res) => res.send('hello world'))

    // assets
    this.app.use('/assets', express.static(Path.join(Config.paths.desktopRoot, 'assets')))

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
    log.verbose(`Killing old server on ${Config.ports.server}...`)
    await killPort(Config.ports.server)
    this.app.listen(Config.ports.server, () => {
      log.info('Server listening', Config.ports.server)
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
}
