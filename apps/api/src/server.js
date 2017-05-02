import http from 'http'
import proxy from 'express-http-proxy'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import SuperLogin from 'superlogin'
import { GitHubStrategy } from 'passport-github'
import { GoogleStrategy } from 'passport-google-oauth'
import { FacebookStrategy } from 'passport-facebook'
import config from './superlogin.config.js'
import { COUCH_URL, APP_URL, SERVER_PORT } from './keys'

export default class Server {
  constructor() {
    const app = express()
    const port = SERVER_PORT

    app.set('port', port)
    app.use(logger('dev'))

    // CORS
    app.use(cors({ origin: APP_URL }))

    app.use(
      '/',
      proxy(COUCH_URL, {
        preserveHostHdr: true,
        proxyReqOptDecorator(proxyReqOpts, srcReq) {
          proxyReqOpts.headers['Access-Control-Allow-Credentials'] = true
          console.log(proxyReqOpts.headers)
          return proxyReqOpts
        },
      })
    )

    // middleware
    // app.use(bodyParser.json())
    // app.use(bodyParser.urlencoded({ extended: false }))

    // // SUPERLOGIN
    // const superlogin = new SuperLogin(config)
    // const strategies = [
    //   ['facebook', FacebookStrategy],
    //   ['github', GitHubStrategy],
    //   ['google', GoogleStrategy],
    // ]
    // strategies.forEach(([name, strategy]) => {
    //   if (superlogin.config.getItem(`providers.${name}.credentials.clientID`)) {
    //     superlogin.registerOAuth2(name, strategy)
    //   }
    // })

    // // https redirect unless using localhost
    // app.use((req, res, next) => {
    //   if (
    //     req.protocol === 'https' ||
    //     req.header('X-Forwarded-Proto') === 'https' ||
    //     req.hostname === 'localhost'
    //   ) {
    //     return next()
    //   }
    //   res.status(301).redirect(`https://${req.headers['host']}${req.url}`)
    // })

    // superlogin routes
    // app.use('/couch/auth', superlogin.router)

    this.server = app
  }

  start() {
    const port = this.server.get('port')
    console.log('Server starting on port', port)
    http.createServer(this.server).listen(port)
  }
}
