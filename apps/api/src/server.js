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
import request from 'request'

export default class Server {
  proxy(prefix, url) {
    return (req, res, next) => {
      console.log(req.path)
      console.log('req', req.path, req.headers)
      if (req.path.indexOf(prefix) === 0) {
        const uri = url + req.path.slice(prefix.length)
        console.log('uri', uri)
        const requestObj = {
          uri,
          method: req.method,
          qs: req.query,
        }
        console.log(requestObj)
        req.pipe(request(requestObj)).pipe(res)
      } else {
        next()
      }
    }
  }

  constructor() {
    const app = express()
    const port = SERVER_PORT

    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))

    // proxy couchdb
    console.log('proxy', '/couch', COUCH_URL)
    app.use(this.proxy('/couch', COUCH_URL))

    // 👋
    app.get('/', (req, res) => {
      res.send('hello world')
    })

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
