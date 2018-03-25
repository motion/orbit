import 'babel-polyfill'
import 'isomorphic-fetch'
import '@mcro/debug/inject'
import '@mcro/black/mlog'
import global from 'global'
import * as Mobx from 'mobx'

Error.stackTraceLimit = Infinity
global.Mobx = Mobx

const log = debug('index')

console.warn(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
}

const Desktop = require('./desktop').default
const dTop = new Desktop()

const exitHandler = async code => {
  console.log('handling exit', code)
  if (await dTop.dispose()) {
    // otherwise it wont exit :/
    process.kill(process.pid)
  }
}

// do something when app is closing
process.on('exit', exitHandler)
// ctrl+c event
process.on('SIGINT', exitHandler)
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
