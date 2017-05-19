import http from 'http'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { RateLimit, ExpressMiddleware } from 'ratelimit.js'
import config from './superlogin.config.js'
import { APP_URL, COUCH_URL, SERVER_PORT, REDIS_HOSTNAME } from './keys'
import redis from 'redis'
import Path from 'path'
import Login from './superlogin'
import repStream from 'express-pouchdb-replication-stream'

export default class Server {
  constructor() {
    const app = express()
    const port = SERVER_PORT

    // express
    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', (req, res) => {
      res.send('hello world')
    })

    // streaming couch proxy
    app.get(
      '/couch/:db',
      repStream({
        url: COUCH_URL,
        dbReq: true,
      })
    )

    // superlogin
    this.login = new Login()
    app.use('/auth', this.login.router)

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
    app.use(
      limiter.middleware((req, res) => {
        res.status(429).json({ message: 'rate limit exceeded' })
      })
    )

    this.server = app
  }

  start() {
    const port = this.server.get('port')
    http.createServer(this.server).listen(port)
    console.log('server started on port', port)
  }
}
