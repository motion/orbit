import http from 'http'
import logger from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import * as Constants from '~/constants'
import SuperLogin from './server/superlogin'
import config from './server/superlogin.config'

export default class Server {
  login = null

  constructor() {
    this.setupServer()
    this.setupLogin()
  }

  start() {
    const port = this.server.get('port')
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

  setupServer() {
    const app = express()
    const port = Constants.SERVER_PORT

    // express
    app.set('port', port)
    app.use(logger('dev'))
    // app.use('*', cors())

    const HEADER_ALLOWED =
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token'

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
      next()
    })

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', (req, res) => {
      res.send('~hello world~')
    })

    this.server = app
  }

  setupLogin() {
    this.login = new SuperLogin(config)
    this.server.use('/api/auth', this.login.router)
  }
}
