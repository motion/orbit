import 'raf/polyfill'
import { setConfig } from './config'
import * as Path from 'path'
import { logger } from '@mcro/logger'
import waitPort from 'wait-port'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const log = logger('electron')

Error.stackTraceLimit = Infinity

export async function main(): Promise<number | void> {
  log(`Starting electron in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    require('source-map-support/register')
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

  // set config before starting app
  setConfig({
    env: {
      prod: process.env.NODE_ENV !== 'development',
    },
    server: {
      url: `http://localhost:${Config.ports.server}`,
      host: 'localhost',
      port: `${Config.ports.server}`,
    },
    directories: {
      root: Path.join(__dirname, '..'),
    },
  })

  // require app after setting config
  const { ElectronApp } = require('./ElectronApp')
  new ElectronApp()
}
