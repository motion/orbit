import http from 'http'
import logger from 'morgan'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import SuperLogin from 'superlogin'
import { GitHubStrategy } from 'passport-github'
import { GoogleStrategy } from 'passport-google-oauth'
import { FacebookStrategy } from 'passport-facebook'
import config from './superlogin.config.js'
import { APP_URL, SERVER_PORT } from './keys'
import Path from 'path'

export default class Server {
  constructor() {
    const app = express()
    const port = SERVER_PORT

    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))
    // app.use(express.limit('1mb'))

    // middleware
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

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

    // superlogin routes
    // app.use('/couch/auth', superlogin.router)

    this.server = app
  }

  start() {
    const port = this.server.get('port')
    http.createServer(this.server).listen(port)
    console.log('server started on port', port)
  }
}
