import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import bodyParser from 'body-parser'
import express from 'express'
import proxy from 'http-proxy-middleware'
import killPort from 'kill-port'
import * as Path from 'path'
import { graphqlExpress } from 'graphql-server-express'
import SlackApp from '@o/slack-app'
import { getRepository } from 'typeorm'
import { AppEntity } from '@o/models'
import { altairExpress } from 'altair-express-middleware'

const log = new Logger('desktop')
const Config = getGlobalConfig()

export class WebServer {
  cache = {}
  login = null
  server: express.Application

  constructor() {
    this.server = express()
    this.server.set('port', Config.ports.server)
    this.server.use(this.cors())
    // fixes bug with 304 errors sometimes
    // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
    this.server.disable('etag')

    // ROUTES
    this.server.use(bodyParser.json({ limit: '2048mb' }))
    this.server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.server.get('/hello', (_, res) => res.send('hello world'))

    // assets
    this.server.use('/assets', express.static(Path.join(Config.paths.desktopRoot, 'assets')))

    // config
    this.server.get('/config', (_, res) => {
      const config = getGlobalConfig()
      log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
      res.json(config)
    })

    this.setupOrbitApp()
  }

  start() {
    return new Promise(async res => {
      log.info('start()')

      log.verbose(`Killing old server on ${Config.ports.server}...`)
      await killPort(Config.ports.server)

      // graphql
      const schema = await SlackApp.graph(app)
      this.server.use(
        '/graphql',
        bodyParser.json(),
        graphqlExpress({
          schema,
        }),
      )
      const app = await getRepository(AppEntity).findOne({
        where: {
          identifier: 'slack',
          token: {
            $not: {
              $equal: '',
            },
          },
        },
      })
      this.server.use(
        '/altair',
        altairExpress({
          endpointURL: '/graphql',
          // subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
          // initialQuery: `{ getData { id name surname } }`,
        }),
      )

      this.server.listen(Config.ports.server, () => {
        res()
        log.info('Server listening', Config.ports.server)
      })
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

  private setupOrbitApp() {
    // proxy to webpack-dev-server in development
    if (process.env.NODE_ENV === 'development') {
      const webpackUrl = 'http://localhost:3999'
      const router = {
        [`http://localhost:${Config.ports.server}`]: webpackUrl,
      }
      this.server.use(
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
      this.server.use(express.static(Config.paths.appStatic))
      this.server.use((_, res) => res.sendFile(Path.join(Config.paths.appStatic, 'index.html')))
    }
  }
}
