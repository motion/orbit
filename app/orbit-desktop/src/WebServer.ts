import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import bodyParser from 'body-parser'
import killPort from 'clear-port'
import express, { Handler } from 'express'
import * as Path from 'path'

const log = new Logger('WebServer')
const Config = getGlobalConfig()

export function cors() {
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

export class WebServer {
  cache = {}
  login = null
  server: express.Application

  constructor(config: { middlewares: Handler[] }) {
    this.server = express()
    this.server.set('port', Config.ports.server)

    // ensure nothing hangs, useful for debugging if you mess up a middleware
    // this.server.use(connectTimeout('5s'))

    // this.server.use(cors())

    // fixes bug with 304 errors sometimes
    // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
    this.server.disable('etag')

    // ROUTES
    this.server.use(bodyParser.json({ limit: '2048mb' }))
    this.server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

    // test
    this.server.get('/hello', (_, res) => res.send('hello world'))

    // assets
    this.server.use('/assets', express.static(Path.join(Config.paths.desktopRoot, 'assets')))

    // config
    this.server.get('/config', (_, res) => {
      const config = getGlobalConfig()
      log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })

    // this needs be in front of cors for the app middlewares!
    for (const middleware of config.middlewares) {
      this.server.use(middleware)
    }
  }

  start() {
    return new Promise(async res => {
      log.verbose(`Killing old server on ${Config.ports.server}...`)
      await killPort(Config.ports.server)

      this.setupOrbitApp()

      this.server.listen(Config.ports.server, () => {
        res()
        log.info(`Server listening ${Config.ports.server}`)
      })
    })
  }

  private setupOrbitApp() {
    // serve static in production
    if (process.env.NODE_ENV !== 'development') {
      log.info(`Serving orbit static app in ${Config.paths.appStatic}...`)
      this.server.use(express.static(Config.paths.appStatic))
      this.server.use((_, res) => res.sendFile(Path.join(Config.paths.appStatic, 'index.html')))
    }
  }
}
