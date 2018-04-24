import 'isomorphic-fetch'
import '@mcro/debug/inject'
import '@mcro/black/mlog'
import * as Mobx from 'mobx'
import debug from '@mcro/debug'

require('module-alias').addAlias('~', __dirname + '/')

Error.stackTraceLimit = Infinity

const log = debug('index')

console.warn(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
  // @ts-ignore
  global.Mobx = Mobx
  // @ts-ignore
  global.require = require
  // @ts-ignore
  global.Path = require('path')
  // @ts-ignore
  global._ = require('lodash')
  // @ts-ignore
  global.r2 = require('@mcro/r2')
  // @ts-ignore
  global.Constants = require('./constants')
}

const Desktop = require('./desktop').default
const rootStore = new Desktop()

const exitHandler = async (code?: any) => {
  console.log('handling exit', code)
  if (await rootStore.dispose()) {
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
    await rootStore.start()
  } catch (err) {
    log('error', err)
  }
}

run()
