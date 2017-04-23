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
import { DB_PROTOCOL, DB_HOST } from './keys'

const app = express()
const port = process.env.PORT || 3000

console.log('Server starting on port', port)
// console.log('Couch url:', COUCH_URL)

app.set('port', port)
app.use(logger('dev'))

// CORS
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
)

app.use('/', proxy(`http://${DB_HOST}`))

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

http.createServer(app).listen(app.get('port'))
