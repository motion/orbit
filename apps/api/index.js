const http = require('http')
const logger = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const SuperLogin = require('superlogin')
const { GitHubStrategy } = require('passport-github')
const { GoogleStrategy } = require('passport-google-oauth')
const { FacebookStrategy } = require('passport-facebook')

const config = require('./superlogin.config.js')

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const superlogin = new SuperLogin(config)

const strategies = [
  ["facebook", FacebookStrategy],
  ["github", GitHubStrategy],
  ["google", GoogleStrategy],
]

strategies.forEach(([name, strategy]) => {
  if(superlogin.config.getItem(`providers.${name}.credentials.clientID`)) {
    superlogin.registerOAuth2(name, strategy)
  }
})

// https redirect unless using localhost
app.use((req, res, next) => {
  if (
    req.protocol === 'https'
    || req.header('X-Forwarded-Proto') === 'https'
    || req.hostname === 'localhost'
  ) {
    return next()
  }
  res.status(301).redirect(`https://${req.headers['host']}${req.url}`)
})

// superlogin routes
app.use('/auth', superlogin.router)

app.use(express.static('client'))

http.createServer(app).listen(app.get('port'))
