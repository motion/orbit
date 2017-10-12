import http from 'http'
import logger from 'morgan'
import express from 'express'
import proxy from 'http-proxy-middleware'
import session from 'express-session'
import bodyParser from 'body-parser'
import * as Constants from '~/constants'
import OAuth from './server/oauth'
import OAuthStrategies from './server/oauth.strategies'
import Passport from 'passport'
// import { User } from '@mcro/models'
import PouchRouter from 'express-pouchdb'

const port = Constants.SERVER_PORT

export default class Server {
  login = null

  constructor({ pouch }) {
    this.cache = {}
    this.pouch = pouch
    this.oauth = new OAuth({
      strategies: OAuthStrategies,
      onSuccess: async (service, token, refreshToken, info) => {
        // const user = await User.findOrCreate('a@b.com')
        // await user.mergeUpdate({
        //   authorizations: {
        //     [service]: res,
        //   },
        // })
        return { token, refreshToken, info }
      },
      findInfo: provider => {
        return this.cache[provider]
      },
      updateInfo: (provider, info) => {
        this.cache[provider] = info
      },
      // updateUser: async res => {
      //   if (!res.info || !res.info.provider) {
      //     throw new Error(`Don't see a provider for ${res}`)
      //   }
      //   const user = await User.findOrCreate('a@b.com')
      //   if (!user) {
      //     throw new Error(`Don't see a user`)
      //   }
      //   await user.mergeUpdate({
      //     authorizations: {
      //       [res.info.provider]: res,
      //     },
      //   })
      // },
    })

    const app = express()
    app.set('port', port)
    // app.use(logger('dev'))

    this.app = app

    // ROUTES
    this.setupPassportRoutes()
    this.setupPouch()
    this.setupProxy()
  }

  start() {
    http.createServer(this.app).listen(port)
    return port
  }

  dispose() {
    console.log('dispose server')
  }

  verifySession = async (username, token) => {
    const user = await this.login.getUser(username)
    if (!user) {
      return false
    }
    const session = user.session[token]
    if (!session) {
      return false
    }
    if (typeof session.expires !== 'number') {
      console.log('non-number session')
      return false
    }
    return session.expires > Date.now()
  }

  setupProxy() {
    this.app.use(
      '/',
      proxy({
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'warn',
      })
    )
  }

  setupPouch() {
    // const dbPaths = Object.keys(Models)
    //   .map(model => Models[model].title)
    //   .map(name => `/db/${name}`)

    // rewrite rxdb paths to non-rxdb :)
    this.app.use(
      '/db',
      proxy({
        target: '/db2',
        pathRewrite: path => {
          if (path === '/db' || path === '/db/') {
            return '/'
          }
          const newPath = path.replace(
            /\/db\/(.*)([\/\?].*)?$/g,
            '/username-rxdb-0-$1$2'
          )
          return newPath
        },
      })
    )

    // pouch routes
    this.app.use('/db2', PouchRouter(this.pouch, { inMemoryConfig: true }))
  }

  setupPassportRoutes() {
    this.setupAuthRoutes()
    this.setupAuthRefreshRoutes()
    this.setupAuthReplyRoutes()
  }

  setupAuthRoutes() {
    this.app.use('/auth', bodyParser.json())
    this.app.use('/auth', bodyParser.urlencoded({ extended: false }))
    // TODO change secret
    this.app.use(
      '/auth',
      session({ secret: 'orbit', resave: false, saveUninitialized: true })
    )
    this.app.use('/auth', Passport.initialize())
    this.app.use('/auth', Passport.session())
  }

  setupAuthRefreshRoutes() {
    this.app.use('/auth/refreshToken/:service', async (req, res) => {
      console.log('refresh for', req.params.service)
      try {
        const refreshToken = await this.oauth.refreshToken(req.params.service)
        res.json({ refreshToken })
      } catch (error) {
        console.log('error', error)
        res.status(500)
        res.json({ error })
      }
    })
  }

  setupAuthReplyRoutes() {
    for (const name of Object.keys(OAuthStrategies)) {
      const path = `/auth/${name}`
      const options = OAuthStrategies[name].options
      this.app.get(path, Passport.authenticate(name, options))
      this.app.get(
        `/auth/${name}/callback`,
        Passport.authenticate(name, options),
        (req, res) => {
          const { user } = req
          res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Authentication Success</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
</head>
<body>
<script type="text/javascript">
  if (window.opener) {
    window.opener.focus()
    const info = {
      refreshToken: ${JSON.stringify(user.refreshToken)},
      token: ${JSON.stringify(user.token)},
      error: ${JSON.stringify(user.error)},
      info: ${JSON.stringify(user.info)},
    }
    if (window.opener.passport && window.opener.passport.oauthSession) {
      window.opener.passport.oauthSession(info)
    }
  }
  window.close()
</script>
</body>
</html>
          `)
        }
      )
    }
  }
}
