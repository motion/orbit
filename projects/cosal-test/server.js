let express = require('express')
let { Cosal } = require('@mcro/cosal')

const cosal = new Cosal()
cosal.start()

const app = express()

app.get('/', async (_req, res) => {
  const words = await cosal.getWordWeights('hello what what why this is weird bread cheese pizza')
  res.send(JSON.stringify(words))
})

app.listen(4444)
