import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import functions from 'firebase-functions'

class ApiSearchServer {
  app = express()

  start() {
    this.app.use(cors({ origin: true }))
    this.app.use(bodyParser.json({ limit: '2048mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

    this.app.use('/search', (req, res) => {
      console.log('req', req)
      res.send({
        ok: true,
      })
    })

    this.app.use('/index', (req, res) => {
      console.log('req', req)
      res.send({
        ok: true,
      })
    })
  }
}

const api = new ApiSearchServer()

export const search = functions.https.onRequest(api.app)
