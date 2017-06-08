import http from 'http'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { RateLimit, ExpressMiddleware } from 'ratelimit.js'
import { APP_URL, COUCH_URL, SERVER_PORT, REDIS_HOSTNAME } from './keys'
import redis from 'redis'
import Path from 'path'
import repStream from 'express-pouchdb-replication-stream'
import Login from './login'
import config from './login/superlogin.config'

export default class Server {
  constructor() {
    this.setupServer()
    this.setupRateLimiting()
    this.setupCouchProxy()
    this.setupLogin()
  }

  setupServer() {
    const app = express()
    const port = SERVER_PORT

    // express
    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      )
      next()
    })

    app.get('/', (req, res) => {
      res.send('hello world')
    })

    this.server = app
  }

  setupLogin() {
    this.login = new Login(config)
    this.server.use('/auth', this.login.router)
  }

  setupRateLimiting() {
    // rate limiting
    const redisClient = redis.createClient({
      host: REDIS_HOSTNAME,
    })
    const rateLimiter = new RateLimit(redisClient, [
      { interval: 1, limit: 100 },
    ])
    const limiter = new ExpressMiddleware(rateLimiter, {
      ignoreRedisErrors: false,
    })
    this.server.use(
      limiter.middleware((req, res) => {
        res.status(429).json({ message: 'rate limit exceeded' })
      })
    )
  }

  setupCouchProxy() {
    // streaming couch proxy
    this.server.get(
      '/couch/:db',
      repStream({
        url: COUCH_URL,
        dbReq: true,
      })
    )
  }

  start() {
    const port = this.server.get('port')
    http.createServer(this.server).listen(port)
    console.log('server started on port', port)
  }
}
