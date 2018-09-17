import 'raf/polyfill'
import { Logger } from '@mcro/logger'
import waitPort from 'wait-port'
import { app } from 'electron'

const log = new Logger('electron')

Error.stackTraceLimit = Infinity

export async function main(): Promise<number | void> {
  log.info(`Starting electron in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    require('source-map-support/register')
    require('./helpers/installGlobals')
    require('./helpers/watchForAppRestarts').watchForAppRestarts()
    await waitPort({ port: 3999 })
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
  }

  // we hide it already in prod, lets hide it in dev
  if (process.env.NODE_ENV === 'development') {
    app.dock.hide()
  }

  // require app after setting config
  const { ElectronApp } = require('./ElectronApp')
  new ElectronApp()
}
