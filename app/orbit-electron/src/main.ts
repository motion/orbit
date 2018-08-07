import 'source-map-support/register'
import 'raf/polyfill'
import { setConfig } from './config'
import * as Path from 'path'

Error.stackTraceLimit = Infinity

export async function main({ port }) {
  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    require('./helpers/installGlobals')
    require('./helpers/watchForAppRestarts').watchForAppRestarts()
    const waitPort = require('wait-port')
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
  if (process.env.NODE_ENV === 'production') {
    require('./helpers/startDesktopInProcess')
  }

  // set config before starting app
  setConfig({
    env: {
      prod: process.env.NODE_ENV === 'production',
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
  new ElectronApp({ port })
}
