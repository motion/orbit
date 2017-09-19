import http from 'http'
import logger from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import * as Constants from '~/constants'
import OAuth from './server/oauth'
import OAuthStrategies from './server/oauth.strategies'
import Passport from 'passport'

const port = Constants.SERVER_PORT

export default class Server {
  login = null

  constructor() {
    this.oauth = new OAuth({
      strategies: OAuthStrategies,
      onSuccess: async (service, token, refreshToken, info) => {
        console.log('got info', token, refreshToken, info)
        return { token, refreshToken, info }
      },
    })

    this.app = express()
    this.setupServer()
    this.setupPassport()
    this.setupProxy()
  }

  start() {
    http.createServer(this.server).listen(port)
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

  setupServer(app) {
    this.app.set('port', port)
    this.app.use(logger('dev'))

    const HEADER_ALLOWED =
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token'

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
      next()
    })

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }

  setupProxy() {
    this.app.use('/', proxy({ target: 'http://localhost:3001', ws: true }))
  }

  setupPassport() {
    for (const name of Object.keys(OAuthStrategies)) {
      const path = `/auth/${name}`
      this.app.get(path, Passport.authenticate(name))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name),
        (req, res) => {
          res.redirect('/')
        }
      )
      console.log(`Oauth setup: ${path}`)
    }

    this.app.use(Passport.initialize())
  }
}
