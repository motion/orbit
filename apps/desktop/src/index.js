import 'babel-polyfill'
import 'isomorphic-fetch'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
}
// if (!process.env.HAS_BABEL_POLYFILL) {
//   require()
// }

const Desktop = require('./desktop').default
const dTop = new Desktop()

const exitHandler = code => {
  console.log('exitHandler', code)
  dTop.dispose()
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
  console.log('uncaughtException', ...args)
  // process.exit(0)
})
// promise exceptions
process.on('unhandledRejection', function(reason, promise) {
  console.log(
    'Desktop: Possibly Unhandled Rejection at: Promise ',
    promise,
    ' reason: ',
    reason,
  )
  console.log(reason.stack)
})

export async function run() {
  try {
    await dTop.start()
  } catch (err) {
    console.log('error', err)
  }
}

run()
