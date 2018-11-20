let express = require('express')
let { Cosal } = require('@mcro/cosal')
let cors = require('cors')
let Path = require('path')

const vectors = JSON.parse(
  require('fs').readFileSync(Path.join(__dirname, 'app_data/enwiki9.vec.json')),
)
const cosal = new Cosal({
  vectors,
  // fallbackVector: vectors.hello,
})

async function start() {
  await cosal.start()

  const items = [
    // if you want to load some more stuff, just throw it here
    // module.exports = string[]
    // ...require('./app_data/myBits'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),

    // if you want to test about 100k
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
    ...require('./data/elonout'),
    ...require('./data/text2k'),
  ].map((text, id) => ({
    id,
    text,
  }))

  console.log('scanning...', items.length)
  await cosal.scan(items)
  console.log('scanned')

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

  app.get('/topics', async (req, res) => {
    const results = await cosal.topics(req.query.query)
    res.send(JSON.stringify(results))
  })

  const blob = items.map(x => x.text).join(' ')

  app.get('/topWords', async (req, res) => {
    const results = await cosal.getTopWords(blob, { max: 50, sortByWeight: true })
    res.send(JSON.stringify(results))
  })

  app.listen(4444)
  console.log('listening')
}

start()
