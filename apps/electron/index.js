process.env.NODE_ENV = 'production'
process.env.IS_PROD = true
process.env.HAS_BABEL_POLYFILL = true
import global from 'global'

require('babel-polyfill')

// shim groupCollapsed for sitrep
global.console.groupCollapsed = (...args) => {
  console.log(...args)
}

process.on('unhandledRejection', function(error, p) {
  console.log('PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

const electronApp = require('./es6/index').default
electronApp()

setTimeout(() => {
  const startApi = require('@mcro/api').default
  startApi().then(() => {
    console.log('started')
  })
}, 100)
