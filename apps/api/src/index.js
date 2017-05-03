console.log('starting api...')

require('dotenv').config()

const API = require('./api').default

const api = new API({})

api.start()
