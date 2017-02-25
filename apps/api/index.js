import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import logger from 'morgan'
import SuperLogin from 'superlogin'

const app = express()
const port = process.env.PORT || 3000
console.log('starting on', port)
app.set('port', port)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const config = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: '',
    password: '',
    userDB: 'users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
        }
    }
  },
  userDBs: {
    defaultDBs: {
      private: ['supertest']
    }
  }
}

// Initialize SuperLogin
const superlogin = new SuperLogin(config)

// Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router)

http.createServer(app).listen(app.get('port'))
