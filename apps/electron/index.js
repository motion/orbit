require('babel-polyfill')
process.env.HAS_BABEL_POLYFILL = true

require('./lib/index').start()

if (!process.env.DISABLE_API) {
  setTimeout(() => {
    // api
    const startApi = require('@mcro/api').default
    startApi().then(() => {
      console.log('started')
    })
  }, 100)
}
