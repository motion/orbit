let express = require('express')
let { Cosal } = require('@mcro/cosal')
let cors = require('cors')

const cosal = new Cosal()
cosal.start()

const app = express()
app.use(cors())

app.get('/weights', async (req, res) => {
  const words = await cosal.getWordWeights(req.query.query)
  console.log('words', words)
  res.send(JSON.stringify(words))
})

app.get('/search', async (req, res) => {
  const words = await cosal.search(req.query.query)
  res.send(JSON.stringify(words))
})

app.listen(4444)
