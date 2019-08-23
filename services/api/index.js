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

function getFireStoreList(results /* : FirebaseFirestore.QuerySnapshot */) /* : any[] */ {
  let all = []
  results.forEach(x => {
    all.push(x.data())
  })
  return all
}

// because for some reason firebase functions dont accept .query
app.get('/apps', async (_, res) => {
  const db = admin.firestore()
  try {
    res.send(
      getFireStoreList(
        await db
          .collection('apps')
          .orderBy('installs', 'desc')
          .limit(40)
          .get(),
      ),
    )
  } catch (err) {
    console.error(err.message, err.stack)
    res.status(500)
    res.send({
      error: err.message,
    })
  }
})

// because for some reason firebase functions dont accept .query
app.get('/apps/:identifier', async (req, res) => {
  const db = admin.firestore()
  try {
    const id = req.params.identifier || ''
    console.log('looking up', id)
    const item = await db
      .collection('apps')
      .doc(id)
      .get()

    if (item.exists) {
      res.send(item.data())
    } else {
      res.send({
        error: `not found ${id}`,
      })
    }
  } catch (err) {
    console.error(err.message, err.stack)
    res.status(500)
    res.send({
      error: err.message,
    })
  }
})

// because for some reason firebase functions dont accept .query
app.get('/search/:query?', async (req, res) => {
  const query = (req.params.query || '').split('-').join(' ')
  console.log('query', query, req.params.query)
  const db = admin.firestore()

  try {
    // TODO: make it do multiple where() so it narrows, fall back to "or where"
    const results = getFireStoreList(
      await db
        .collection('apps')
        .where('search', 'array-contains', query)
        .limit(20)
        .get(),
    )
    res.send(results)
  } catch (err) {
    console.error(err.message, err.stack)
    res.status(500)
    res.send({
      error: err.message,
    })
  }
})

// because for some reason firebase functions dont accept .query
app.get('/search/:search?', async (req, res) => {
  const query = `${req.path || ''}`
    .replace('/search/', '')
    .split('-')
    .join(' ')

  console.log('query', query)
  const db = admin.firestore()

  try {
    // TODO: make it do multiple where() so it narrows, fall back to "or where"
    const results = getFireStoreList(
      await db
        .collection('apps')
        .where('search', 'array-contains', query)
        .limit(20)
        .get(),
    )
    res.send(results)
  } catch (err) {
    console.error(err.message, err.stack)
    res.status(500)
    res.send({
      error: err.message,
    })
  }
})

app.post('/searchUpdate', async (req, res) => {
  const packageId = req.body.packageId
  const identifier = req.body.identifier || ''
  const name = req.body.name || ''
  const icon = req.body.icon || ''
  const features = req.body.features || []
  const setup = req.body.setup || null
  const author = req.body.author || ''

  if (!packageId || !identifier || !name || !icon) {
    res.send({
      error: 'One of packageId, name, identifier, icon: not set',
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

    const versions = Object.keys(registryInfo.versions)
    const lastVersion = registryInfo.versions[versions[versions.length - 1]]
    const { description = '' } = lastVersion
    const fullDescription = req.body.fullDescription || ''

    const db = admin.firestore()
    const docRef = db.collection('apps').doc(identifier)

    // : ApiSearchItem
    const next = {
      packageId,
      fullDescription,
      description,
      identifier,
      name,
      icon,
      features,
      setup,
      author,
      search: stopword.removeStopwords(description.split(' ')).map(x => x.toLowerCase()),
    }

    // TODO only update if doesnt exist for this version
    const doc = await docRef.get()

    if (!doc.exists) {
      docRef.create({
        ...next,
        installs: 0,
      })
    } else {
      docRef.update(next)
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

// Create "main" function to host all other top-level functions
const main = express()
main.use('/api', app)

exports.main = functions.https.onRequest(main)
