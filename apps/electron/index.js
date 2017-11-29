// this is only loaded in production!

process.env.NODE_ENV = 'production'
process.env.HAS_BABEL_POLYFILL = true

require('babel-polyfill')
// electron app

if (process.env.NODE_ENV === 'production') {
  require('./build/app')
} else {
  require('./lib/index')
}

setTimeout(() => {
  // api
  const startApi = require('@mcro/api').default
  startApi().then(() => {
    console.log('started')
  })
}, 100)
