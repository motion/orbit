import OAuth from './oauth'
import OAuthStrategies from './oauthStrategies'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import Passport from 'passport'
import { OauthValues } from './oauthTypes'

const log = console.log.bind(console)

export class Server {
  cache = {}
  login = null
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
    const app = express()
    app.set('port', 443)
    app.use(morgan('dev'))

    this.app = app

    app.use(this.cors())

    // ROUTES
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.app.get('/hello', (_, res) => res.send('hello world'))

    this.setupPassportRoutes()
  }

  async start() {
    this.app.listen(443, () => {
      console.log('listening at port', 443)
    })
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
          const values: OauthValues = req.user || req['currentUser']
          res.send(`
<html>
  <head>
    <title>Finish Orbit Auth</title>
    <script>
      var url = "http://private.tryorbit.com?value=${encodeURIComponent(
        JSON.stringify(values),
      )}"
      window.location = url
    </script>
  </head>
  <body>All done, closing...</body>
</html>
`)
        },
      )
    }
  }
}
