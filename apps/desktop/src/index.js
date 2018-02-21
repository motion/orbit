import 'babel-polyfill'
import 'isomorphic-fetch'
import '@mcro/debug/inject'

const log = debug('index')

log('process.env.NODE_ENV', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
}

const Desktop = require('./desktop').default
const dTop = new Desktop()

const exitHandler = async code => {
  await dTop.dispose()
  process.exit(code === 1 ? 1 : 0)
  process.kill(process.pid)
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
process.on('SIGSEGV', () => {
  console.log('Segmentation fault on exit')
  exitHandler(1)
})
// uncaught exceptions
process.on('uncaughtException', err => {
  console.log('uncaughtException', err.stack)
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
    log('error', err)
  }
}

run()
