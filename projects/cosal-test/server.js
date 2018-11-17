let express = require('express')
let { Cosal } = require('@mcro/cosal')
let cors = require('cors')

const cosal = new Cosal()
const elonDB = require('./elonout')

async function start() {
  await cosal.start()

  const items = elonDB.map((text, id) => ({ id, text }))
  await cosal.scan(items)

  const app = express()
  app.use(cors())

  app.get('/weights', async (req, res) => {
    const words = await cosal.getWordWeights(req.query.query)
    console.log('words', words)
    res.send(JSON.stringify(words))
  })

  app.get('/search', async (req, res) => {
    const results = await cosal.search(req.query.query)
    const resultsText = results.map(({ id, distance }) => ({
      id,
      distance,
      text: items[id].text,
    }))
    res.send(JSON.stringify(resultsText))
  })

  app.listen(4444)
}

start()
