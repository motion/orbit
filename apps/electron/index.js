process.env.NODE_ENV = 'production'
process.env.IS_PROD = true
process.env.HAS_BABEL_POLYFILL = true

require('babel-polyfill')
const electronApp = require('./es6/index').default
electronApp()

setTimeout(() => {
  const startApi = require('@mcro/api').default
  startApi().then(() => {
    console.log('started')
  })
}, 100)
