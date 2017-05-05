console.log('starting api...')

const API = require('./api').default

const api = new API({})

api.start()
