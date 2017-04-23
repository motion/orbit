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
import couchProxy from 'express-couch-proxy'
import { COUCH_URL } from './keys'

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(logger('dev'))
app.use(cors())

// Proxy Cloudant
// note: before other middleware
const couchMiddleware = couchProxy({ realm: 'couch' }, function(
  db,
  user,
  pass,
  next
) {
  return next(null, `${COUCH_URL}/${db}`)
})
app.use('/couch', couchMiddleware)

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

// https redirect unless using localhost
app.use((req, res, next) => {
  if (
    req.protocol === 'https' ||
    req.header('X-Forwarded-Proto') === 'https' ||
    req.hostname === 'localhost'
  ) {
    return next()
  }
  res.status(301).redirect(`https://${req.headers['host']}${req.url}`)
})

// superlogin routes
app.use('/auth', superlogin.router)

http.createServer(app).listen(app.get('port'))
