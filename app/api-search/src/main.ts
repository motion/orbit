import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import * as functions from 'firebase-functions'

const app = express()

app.use(cors({ origin: true }))
app.use(bodyParser.json({ limit: '2048mb' }))
app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

app.get('/', (_, res) => {
  res.send('home works with or without trailing slash')
})

export const search = functions.https.onRequest(app)
