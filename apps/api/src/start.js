require('dotenv').config()

const API = require('./index').default

const api = new API({})

console.log('Running api...')
console.log(process.env)

api.start()
