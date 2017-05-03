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
import { COUCH_URL, APP_URL, SERVER_PORT } from './keys'
import request from 'request'

const couchRes = res => {
  res.set({
    'Access-Control-Allow-Credentials': 'true',
  })
}

export const proxy = (prefix, couchUrl, replaceWith = '') => (
  req,
  res,
  next
) => {
  if (req.path.indexOf(prefix) === 0) {
    const path = replaceWith + req.path.slice(prefix.length)
    const uri = couchUrl + path

    console.log(req.path, '>>>>>>', uri)
    couchRes(res)

    req
      .pipe(
        request({
          uri,
          method: req.method,
          qs: req.query,
        })
      )
      .pipe(res)
  } else {
    next()
  }
}

export default class Server {
  constructor() {
    const app = express()
    const port = SERVER_PORT

    app.set('port', port)
    app.use(logger('dev'))
    app.use(cors({ origin: APP_URL }))
    // app.use(express.limit('1mb'))

    // proxy couchdb
    app.use(proxy('/couch', COUCH_URL, ''))
    // proxy fauxton
    app.use(proxy('/_utils', COUCH_URL, '/_utils'))
    app.use(proxy('/dashboard.assets', COUCH_URL, '/_utils/dashboard.assets'))
    app.use(proxy('/_session', COUCH_URL, '/_session'))
    app.use(proxy('/_all_dbs', COUCH_URL, '/_all_dbs'))
    app.use(proxy('/_membership', COUCH_URL, '/_membership'))
    // app.use(proxy('/_membership', COUCH_URL, '/_membership'))

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
