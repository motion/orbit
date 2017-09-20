import Path from 'path'
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
import PouchExpress from 'express-pouchdb'
import Pouch from 'pouchdb'
import PouchAdapterMemory from 'pouchdb-adapter-memory'
import PouchAdapterHTTP from 'pouchdb-adapter-http'
import { Models } from '@mcro/models'

const port = Constants.SERVER_PORT

export default class Server {
  login = null

  constructor() {
    Pouch.plugin(PouchAdapterMemory)
    Pouch.plugin(PouchAdapterHTTP)

    this.oauth = new OAuth({
      strategies: OAuthStrategies,
      onSuccess: async (service, token, refreshToken, info) => {
        console.log('got info', token, refreshToken, info)
        return { token, refreshToken, info }
      },
    })

    this.app = express()
    this.app.set('port', port)
    // this.app.use(logger('dev'))

    // MIDDLEWARE
    const HEADER_ALLOWED =
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token'
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
      next()
    })
    this.app.use('/auth', bodyParser.json())
    this.app.use('/auth', bodyParser.urlencoded({ extended: false }))
    this.app.use(
      '/auth',
      session({ secret: 'orbit', resave: false, saveUninitialized: true })
    ) // TODO change secret
    this.app.use('/auth', Passport.initialize())
    this.app.use('/auth', Passport.session())

    // ROUTES
    this.setupPouch()
    this.setupPassportSerialization()
    this.setupPassportRoutes()
    this.setupProxy()
  }

  start() {
    http.createServer(this.app).listen(port)
    return port
  }

  dispose() {
    console.log('dispose server')
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
      console.log('non-number session')
      return false
    }
    return session.expires > Date.now()
  }

  setupProxy() {
    this.app.use(
      '/',
      proxy({
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'warn',
      })
    )
  }

  setupPouch() {
    const dbs = Object.keys(Models).map(model => Models[model].title)

    this.app.use(
      '/db',
      PouchExpress(
        Pouch.defaults({
          adapter: 'memory',
        }),
        {
          inMemoryConfig: true,
          dir: Path.join(__dirname, 'tmp'),
        }
      )
    )

    for (const db of dbs) {
      // creating a pouchdb makes it work
      new Pouch(db)
    }
  }

  setupPassportRoutes() {
    for (const name of Object.keys(OAuthStrategies)) {
      const path = `/auth/${name}`
      this.app.get(path, Passport.authenticate(name))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name),
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

  setupPassportSerialization() {
    let cache = {}

    Passport.serializeUser((user, done) => {
      const id = user.info.id
      cache[id] = user.info
      done(null, id)
    })

    Passport.deserializeUser((id, done) => {
      done(null, cache[id])
    })
  }
}
