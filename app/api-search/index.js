require('isomorphic-fetch')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const stopword = require('stopword')

// @ts-ignore
const serviceAccount = require('./app_data/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://orbit-3b7f1.firebaseio.com',
})

const app = express()

app.use(cors({ origin: true }))
app.use(bodyParser.json({ limit: '2048mb' }))
app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))

app.get('/', async (req, res) => {
  const query = req.params.query
  const db = admin.firestore()

  try {
    const results = await db.collection('apps').where('search', 'array-contains', query)
    res.send(results)
  } catch (err) {
    console.error(err.message, err.stack)
    res.status(500)
    res.send({
      error: err.message,
    })
  }
})

app.post('/index', async (req, res) => {
  const packageId = req.body.packageId
  const identifier = req.body.identifier
  if (!packageId || !identifier) {
    res.send({
      error: 'No packageId or identifier sent in body',
    })
    return
  }
  try {
    const registryInfo = await fetch(`https://registry.tryorbit.com/${packageId}`).then(x =>
      x.json(),
    )

    if (registryInfo.error) {
      res.status(500)
      res.send({
        error: registryInfo.error,
      })
      return
    }

    const { name, description = '' } = registryInfo
    console.log('registryInfo', registryInfo, name, description)
    const db = admin.firestore()
    const docRef = db.collection('apps').doc(identifier)
    const doc = {
      packageId,
      description,
      identifier,
      search: stopword.removeStopwords(description.split(' ')),
    }

    // TODO only update if doesnt exist for this version
    const existing = await docRef.get()
    if (!existing) {
      docRef.create(doc)
    } else {
      docRef.set(doc)
    }

    // success, scan new package

    res.send({
      ok: true,
    })
  } catch (err) {
    console.error(err.message, err.stack)
    res.sendStatus(500)
  }
})

exports.search = functions.https.onRequest(app)
