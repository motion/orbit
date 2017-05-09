import http from 'http'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { RateLimit, ExpressMiddleware } from 'ratelimit.js'
import SuperLogin from 'superlogin'
import { GitHubStrategy } from 'passport-github'
import { GoogleStrategy } from 'passport-google-oauth'
import { FacebookStrategy } from 'passport-facebook'
import config from './superlogin.config.js'
import { APP_URL, SERVER_PORT, REDIS_HOSTNAME } from './keys'
import redis from 'redis'
import Path from 'path'

export default class Server {
  constructor() {
    const app = express()
    const port = SERVER_PORT

    // EXPRESS
    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))
    // app.use(express.limit('1mb'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', (req, res) => {
      res.send('hello world')
    })

    // SUPERLOGIN
    const superlogin = new SuperLogin(config)
    const strategies = [
      ['facebook', FacebookStrategy],
      ['github', GitHubStrategy],
      ['google', GoogleStrategy],
    ]
    strategies.forEach(([name, strategy]) => {
      if (superlogin.config.getItem(`providers.${name}.credentials.clientID`)) {
        superlogin.registerOAuth2(name, strategy)
      }
    })
    app.use('/auth', superlogin.router)

    const redisClient = redis.createClient({
      host: REDIS_HOSTNAME,
    })

    // RATE LIMIT
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
