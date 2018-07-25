import 'source-map-support/register'
import 'raf/polyfill'
import '@mcro/black/mlog.js'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import waitPort from 'wait-port'
import { Electron } from '@mcro/stores'

// now stuff that uses relative paths
require('./helpers/handlePromiseErrors')
require('./helpers/updateChecker')
const { ElectronRoot } = require('./ElectronRoot')

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
process.on('SIGUSR1', () => exitHandler(0))
process.on('SIGUSR2', () => exitHandler(0))
process.on('uncaughtException', err => {
  console.log('uncaughtException', err.stack)
})

let started = false

export async function start() {
  if (started) return
  await waitPort({ port: 3002 })
  await waitPort({ port: 3001 })
  await Electron.start({
    ignoreSelf: true,
  })
  started = true
  console.log(`NODE_ENV=${process.env.NODE_ENV} run electron`)
  render(<ElectronRoot />)
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
      console.log('app down, will restart on next app startup')
      shouldRestart = true
    }
    if (shouldRestart && webRunning) {
      const touchFile = require('path').join(__dirname, '..', '_', 'index.js')
      console.log('restarting after parcel cycle...', touchFile)
      require('touch')(touchFile)
      clearInterval(int)
    }
  }, 1000)
}
