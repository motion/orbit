import 'isomorphic-fetch'
import '@mcro/debug/inject'

require('module-alias').addAlias('~', __dirname + '/')

Error.stackTraceLimit = Infinity

console.warn(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
  require('./helpers/installGlobals')
}

const { Root } = require('./root')
const appRoot = new Root()

const exitHandler = async (code?: any) => {
  console.log('handling exit', code)
  try {
    if (await appRoot.dispose()) {
      // otherwise it wont exit :/
      process.kill(process.pid)
    }
  } catch (err) {
    console.log('error killing', err)
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
  console.log('uncaughtException', err)
})

// promise exceptions
process.on('unhandledRejection', function(reason, promise) {
  if (reason) {
    if (reason.code === 'SQLITE_BUSY') {
      console.log('sqlite busy, reconnecting...')
      appRoot.reconnect()
    }
  }
  console.log('Desktop: Possibly Unhandled Rejection')
  console.log(promise, reason)
  console.log(reason.stack)
})

export async function run() {
  try {
    await appRoot.start()
  } catch (err) {
    console.log('error', err)
  }
}

run()
