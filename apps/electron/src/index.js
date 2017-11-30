import 'babel-polyfill'

process.env.HAS_BABEL_POLYFILL = true

console.log('starting app')
require('./start-app').start()

if (!process.env.DISABLE_API) {
  console.log('starting api')
  setTimeout(() => {
    // api
    const startApi = require('@mcro/api').default
    startApi().then(() => {
      console.log('started')
    })
  }, 100)
}
