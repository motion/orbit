import 'source-map-support/register'
import 'raf/polyfill'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { extras } from 'mobx'
import Root from './Root'

if (process.env.NODE_ENV !== 'production') {
  require('./helpers/monitorResourceUsage')
  require('source-map-support/register')
}

// exit handling
const exitHandler = code => {
  console.log('got exit', code)
  process.exit(code)
}
// dont close instantly
process.stdin.resume()
// do something when app is closing
process.on('exit', exitHandler)
process.on('SIGINT', () => exitHandler(0))
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', (...args) => {
  console.log('uncaughtException', ...args)
})
process.on('unhandledRejection', function(reason, promise) {
  console.log('Electron: Unhandled Rejection Promise ', promise, reason)
  console.log(reason.stack)
})

// share state because node loads multiple copies
extras.shareGlobalState()

let started = false

export function start() {
  if (started) return
  started = true
  console.log('starting electron', process.env.NODE_ENV)
  render(<Root />)
  electronContextMenu()
  electronDebug()
}

if (process.env.NODE_ENV === 'development') {
  start()
}
