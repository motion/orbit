console.log('Running api...')
console.log(process.env)

require('dotenv').config()

const API = require('./api').default

const api = new API({})

api.start()
