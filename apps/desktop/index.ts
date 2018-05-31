import 'isomorphic-fetch'
import '@mcro/debug/inject'
import '@mcro/black/mlog.js'
import * as Mobx from 'mobx'
import debug from '@mcro/debug'
import root from 'global'

require('module-alias').addAlias('~', __dirname + '/')

Error.stackTraceLimit = Infinity

const log = debug('index')

console.warn(`$ NODE_ENV=${process.env.NODE_ENV} run desktop`)

if (process.env.NODE_ENV === 'development') {
  require('source-map-support/register')
  root.Mobx = Mobx
  root.require = require
  root.Path = require('path')
  root._ = require('lodash')
  root.r2 = require('@mcro/r2')
  root.Constants = require('./constants')
}

const { Root } = require('./root')
const appRoot = new Root()

const exitHandler = async (code?: any) => {
  console.log('handling exit', code)
  if (await appRoot.dispose()) {
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
    await appRoot.start()
  } catch (err) {
    log('error', err)
  }
}

run()
