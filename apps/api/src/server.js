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
import Crawler from '@mcro/crawler'
import OCR from '@mcro/ocr'
import debug from 'debug'
import path from 'path'

const { SERVER_PORT } = Constants

const log = debug('api')

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
    app.set('port', SERVER_PORT)

    if (Constants.IS_PROD) {
      app.use(logger('dev'))
    }

    this.app = app

    app.use(this.cors())

    // ROUTES
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.setupCrawler()
    this.setupSearch()
    this.setupCredPass()
    this.setupPassportRoutes()
    this.setupProxy()
  }

  start() {
    http.createServer(this.app).listen(SERVER_PORT)
    return SERVER_PORT
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
        'GET,HEAD,POST,PUT,DELETE,OPTIONS',
      )
      next()
    }
  }

  setupSearch() {
    const searchIndex = require.resolve('@mcro/search')
    const searchDist = path.join(searchIndex, '..', '..', 'build')
    log('setting up search', searchDist)
    this.app.use('/search', express.static(searchDist))
  }

  setupCrawler() {
    this.app.post('/crawler/single', async (req, res) => {
      const { options } = req.body
      if (options) {
        const crawler = new Crawler()
        const results = await crawler.start(options.entry, {
          maxPages: 1,
        })
        if (results && results.length) {
          res.json({ result: results[0] })
        } else {
          res.json({ result: null })
        }
      } else {
        res.sendStatus(500)
      }
    })

    this.app.post('/crawler/exact', async (req, res) => {
      const { options } = req.body
      if (options && options.entries && options.entries.length) {
        const crawler = new Crawler()
        const [entry, ...queue] = options.entries
        const results = await crawler.start(entry, {
          disableLinkFinding: true,
          disableStructureFinding: true,
          queue,
        })
        res.json({ results })
      } else {
        console.log('no options.entries')
        res.sendStatus(500)
      }
    })

    const crawler = new Crawler()
    let results = null

    this.app.post('/crawler/start', async (req, res) => {
      const { options } = req.body
      if (options) {
        await crawler.stop()
        results = null
        crawler.start(options.entry, options).then(vals => {
          results = vals
        })
        // allow crawler to reset
        res.sendStatus(200)
      } else {
        log('No options sent')
        res.sendStatus(500)
      }
    })

    this.app.get('/ocr', async (req, res) => {
      log(`running OCR`)
      const { position, size } = req.query
      if (!position || !position.length) return res.json({})

      const parse = param => param.split(',').map(i => +i)

      const val = await OCR({ position: parse(position), size: parse(size) })
      res.json(val)
    })

    this.app.get('/crawler/results', (req, res) => {
      log(`crawl results: ${(results || []).length} results`)
      res.json(results || [])
    })

    this.app.post('/crawler/stop', async (req, res) => {
      if (await crawler.stop()) {
        res.json({ success: true })
      } else {
        res.json({ success: false })
      }
    })

    this.app.get('/crawler/status', async (req, res) => {
      res.json({ status: crawler.getStatus({ includeResults: true }) })
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
      }),
    )
  }

  setupPassportRoutes() {
    this.app.use(
      '/auth', // TODO change secret
      session({ secret: 'orbit', resave: false, saveUninitialized: true }),
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
        },
      )
    }
  }
}
