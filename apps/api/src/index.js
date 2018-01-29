import 'isomorphic-fetch'

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
}

if (!process.env.HAS_BABEL_POLYFILL) {
  require('babel-polyfill')
}

const API = require('./api').default
const Api = new API()

const exitHandler = code => {
  Api.dispose()
  process.exit(code)
}

// dont close instantly
process.stdin.resume()
// do something when app is closing
process.on('exit', exitHandler)
// ctrl+c event
process.on('SIGINT', () => exitHandler(0))
// "kill pid" (nodemon)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
// uncaught exceptions
process.on('uncaughtException', (...args) => {
  console.log(...args)
  process.exit(0)
})
// promise exceptions
process.on('unhandledRejection', function(reason, promise) {
  console.log(
    'API: Possibly Unhandled Rejection at: Promise ',
    promise,
    ' reason: ',
    reason,
  )
  console.log(reason.stack)
})

export async function run() {
  try {
    await Api.start()
  } catch (err) {
    console.log('error', err)
  }
}

run()
