import 'source-map-support/register'
import 'raf/polyfill'
import { setConfig } from './config'
import * as Path from 'path'
import { logger } from '@mcro/logger'
import waitPort from 'wait-port'

const log = logger('electron')

Error.stackTraceLimit = Infinity

export async function main({ port }) {
  log(`Starting electron with port ${port} in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    require('./helpers/installGlobals')
    require('./helpers/watchForAppRestarts').watchForAppRestarts()
    await waitPort({ port: 3002 })
    await waitPort({ port: 3001 })
    const exitHandler = code => process.exit(code)
    // dont close instantly
    process.stdin.resume()
    // do something when app is closing
    // @ts-ignore
    process.on('exit', exitHandler)
    // @ts-ignore
    process.on('SIGINT', () => exitHandler(0))
    // @ts-ignore
    process.on('SIGUSR1', () => exitHandler(0))
    // @ts-ignore
    process.on('SIGUSR2', () => exitHandler(0))
    // @ts-ignore
    process.on('uncaughtException', err => {
      console.log('uncaughtException', err.stack)
    })
  }

  // start desktop in production
  if (process.env.NODE_ENV !== 'development') {
    log(`In production, starting desktop...`)
    require('./helpers/startDesktopInProcess').startDesktopInProcess(port)
    log(`Waiting for desktop startup to continue...`)
    await waitPort({ port })
    log(`Found desktop, continue...`)
  }

  // set config before starting app
  setConfig({
    env: {
      prod: process.env.NODE_ENV !== 'development',
    },
    server: {
      url: `http://localhost:${port}`,
      host: 'localhost',
      port,
    },
    directories: {
      root: Path.join(__dirname, '..'),
    },
  })

  // require app after setting config
  const { ElectronApp } = require('./ElectronApp')
  new ElectronApp()
}
