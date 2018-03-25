import 'source-map-support/register'
import 'raf/polyfill'
import '@mcro/debug/inject'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import '@mcro/black/mlog'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { extras } from 'mobx'
import Electron from './Electron'

Error.stackTraceLimit = Infinity

if (process.env.NODE_ENV !== 'production') {
  require('./helpers/monitorResourceUsage')
  require('source-map-support/register')
}

// exit handling
const exitHandler = code => process.exit(code)
// dont close instantly
process.stdin.resume()
// do something when app is closing
process.on('exit', exitHandler)
process.on('SIGINT', () => exitHandler(0))
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', err => {
  console.log('uncaughtException', err.stack)
})

// share state because node loads multiple copies
extras.shareGlobalState()

let started = false

export function start() {
  if (started) return
  started = true
  console.warn(`$ NODE_ENV=${process.env.NODE_ENV} run electron`)
  render(<Electron />)
  electronContextMenu()
  electronDebug()
}

if (process.env.NODE_ENV === 'development') {
  start()

  // watch for parcel restarts, then restart electron
  const { check } = require('tcp-port-used')
  let shouldRestart = false
  const int = setInterval(async () => {
    const webRunning = await check(3002, '127.0.0.1')
    if (!webRunning && !shouldRestart) {
      console.log('parcel down, will restart on next start')
      shouldRestart = true
    }
    if (shouldRestart && webRunning) {
      console.log('restarting after parcel cycle...')
      require('touch')(require('path').join(__dirname, '..', 'package.json'))
      clearInterval(int)
    }
  }, 1000)
}
