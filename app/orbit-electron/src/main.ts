import 'source-map-support/register'
import 'raf/polyfill'
import waitPort from 'wait-port'
import { ElectronApp } from './ElectronApp'

Error.stackTraceLimit = Infinity

export async function main({ port }) {
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
  if (process.env.NODE_ENV === 'production') {
    require('@mcro/orbit-desktop')
  }
  new ElectronApp({ port })
}
