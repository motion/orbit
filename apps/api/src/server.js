import http from 'http'
import https from 'https'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { RateLimit, ExpressMiddleware } from 'ratelimit.js'
import * as Constants from './constants'
import redis from 'redis'
import Path from 'path'
import repStream from 'express-pouchdb-replication-stream'
import couchProxy from 'express-couch-proxy'
import Login from './login'
import config from './login/superlogin.config'
import url from 'url'

function getAuth(authHeader) {
  if (!authHeader) return null

  var parts = authHeader.split(' ')

  if (parts.length != 2 || parts[0] != 'Basic') return null

  var creds = new Buffer(parts[1], 'base64').toString(),
    i = creds.indexOf(':')

  if (i == -1) return null

  var username = creds.slice(0, i)
  password = creds.slice(i + 1)

  return [username, password]
}

export default class Server {
  constructor() {
    this.setupServer()
    this.setupRateLimiting()
    this.setupCouchStreamProxy()
    this.setupLogin()
  }

  setupServer() {
    const app = express()
    const port = Constants.SERVER_PORT

    // express
    app.set('port', port)
    app.use(logger('dev'))
    // app.use(cors({ origin: Constants.APP_URL }))

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      )
      next()
    })

    // must be before bodyParser.json
    const subPath = '/couch'
    const remoteURL = url.parse(Constants.COUCH_URL)

    app.use(`${subPath}(/:db)?(/:db/*)?`, (req, res) => {
      const db = req.params && req.params.db
      const request = 'https:' == remoteURL.protocol
        ? https.request
        : http.request
      const path =
        remoteURL.path +
        req.originalUrl.slice(subPath.length + 1, req.originalUrl.length)

      const remoteReq = request(
        {
          headers: req.headers,
          method: req.method,
          hostname: remoteURL.hostname,
          port: remoteURL.port || ('https:' == remoteURL.protocol ? 443 : 80),
          path,
          auth: remoteURL.auth,
        },
        function(remoteRes) {
          // node's HTTP parser has already parsed any chunked encoding
          delete remoteRes.headers['transfer-encoding']

          const toTitleCase = s => `${s[0].toUpperCase()}${s.slice(1)}`

          // 🐛 couch replication fails unless using a properly-cased header
          const CASE_ME = [
            'content-type',
            'access-control-allow-credentials',
            'access-control-allow-origin',
            'access-control-expose-headers',
          ]

          for (const header of CASE_ME) {
            if (remoteRes.headers[header]) {
              const mapped = header.split('-').map(toTitleCase).join('-')
              remoteRes.headers[mapped] = remoteRes.headers[header]
              delete remoteRes.headers[header]
            }
          }

          if (db) {
            remoteRes.headers['Access-Control-Allow-Credentials'] = 'true'
          }

          res.writeHead(remoteRes.statusCode, remoteRes.headers)
          remoteRes.pipe(res)
        }
      )

      req.setEncoding('utf8')
      req.resume()
      req.pipe(remoteReq)
    })

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

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
      host: Constants.REDIS_HOSTNAME,
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

  setupCouchStreamProxy() {
    // streaming couch proxy
    this.server.get(
      '/couch-stream/:db',
      repStream({
        url: Constants.COUCH_URL,
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
