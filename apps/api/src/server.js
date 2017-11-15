import http from 'http'
import logger from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import session from 'express-session'
import bodyParser from 'body-parser'
import * as Constants from '~/constants'
import OAuth from './server/oauth'
import OAuthStrategies from './server/oauth.strategies'
import Passport from 'passport'
import expressPouch from 'express-pouchdb'
import Path from 'path'
import Crawler from '@mcro/crawler'
import debug from 'debug'

const log = debug('api')

const port = Constants.SERVER_PORT

export default class Server {
  login = null

  constructor() {
    this.cache = {}
    this.oauth = new OAuth({
      strategies: OAuthStrategies,
      onSuccess: async (service, token, refreshToken, info) => {
        return { token, refreshToken, info }
      },
      findInfo: provider => {
        return this.cache[provider]
      },
      updateInfo: (provider, info) => {
        this.cache[provider] = info
      },
    })

    const app = express()
    app.set('port', port)

    if (Constants.IS_PROD) {
      app.use(logger('dev'))
    }

    this.app = app

    app.use(this.cors())

    // ROUTES
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.setupCrawler()
    this.setupCredPass()
    this.setupPassportRoutes()
    // this.setupPouch()
    this.setupProxy()
  }

  start() {
    http.createServer(this.app).listen(port)
    return port
  }

  dispose() {
    log('dispose server')
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
        'GET,HEAD,POST,PUT,DELETE,OPTIONS'
      )
      next()
    }
  }

  setupCrawler() {
    const crawlerIndex = require.resolve('@mcro/crawler')
    const crawlerDist = Path.join(crawlerIndex, '..', 'build', 'js')
    log('setting up crawler', crawlerDist)
    this.app.use('/crawler', express.static(crawlerDist))

    const crawler = new Crawler()

    this.app.post('/crawler/start', async (req, res) => {
      log(`Got a request for crawl`)
      const { options } = req.body
      if (options) {
        log('start crawl')
        if (crawler.isRunning) {
          log('stopping previous crawler')
          crawler.stop()
        }
        const results = await crawler.start(options.entry, options)
        log(`crawl results: ${results.length} results`)
        res.json({ results })
      } else {
        log('No options sent')
        res.sendStatus(500)
      }
    })

    this.app.post('/crawler/stop', async (req, res) => {
      let success = false
      if (crawler.isRunning) {
        log('Cancelling crawl')
        crawler.stop()
        success = true
      } else {
        log(`No crawler running`)
      }
      res.json({ success })
    })
  }

  creds = {}
  setupCredPass() {
    this.app.use('/getCreds', (req, res) => {
      if (Object.keys(this.creds).length) {
        res.json(this.creds)
      } else {
        res.json({ error: 'no creds' })
      }
    })
    this.app.use('/setCreds', (req, res) => {
      log('set', typeof req.body, req.body)
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

  setupProxy() {
    const router = {
      [Constants.API_HOST]: Constants.PUBLIC_URL,
    }
    log('proxying', router)
    this.app.use(
      '/',
      proxy({
        target: Constants.PUBLIC_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'warn',
        router,
      })
    )
  }

  setupPouch() {
    // const dbPaths = Object.keys(Models)
    //   .map(model => Models[model].title)
    //   .map(name => `/db/${name}`)

    // rewrite rxdb paths to non-rxdb :)
    this.app.use(
      '/db',
      proxy({
        target: '/db2',
        pathRewrite: path => {
          if (path === '/db' || path === '/db/') {
            return '/'
          }
          const newPath = path.replace(
            /\/db\/(.*)([\/\?].*)?$/g,
            '/username-rxdb-0-$1$2'
          )
          return newPath
        },
      })
    )

    // pouch routes
    this.app.use('/db2', expressPouch(this.pouch, { inMemoryConfig: true }))
  }

  setupPassportRoutes() {
    this.app.use(
      '/auth', // TODO change secret
      session({ secret: 'orbit', resave: false, saveUninitialized: true })
    )
    this.app.use('/auth', Passport.initialize())
    this.app.use('/auth', Passport.session())
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
    for (const name of Object.keys(OAuthStrategies)) {
      const path = `/auth/${name}`
      const options = OAuthStrategies[name].options
      this.app.get(path, Passport.authenticate(name, options))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name, options),
        (req, res) => {
          const { user } = req
          res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Authentication Success</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
</head>
<body>
<script type="text/javascript">
  if (window.opener) {
    window.opener.focus()
    const info = {
      refreshToken: ${JSON.stringify(user.refreshToken)},
      token: ${JSON.stringify(user.token)},
      error: ${JSON.stringify(user.error)},
      info: ${JSON.stringify(user.info)},
    }
    if (window.opener.passport && window.opener.passport.oauthSession) {
      window.opener.passport.oauthSession(info)
    }
  }
  window.close()
</script>
</body>
</html>
          `)
        }
      )
    }
  }
}
