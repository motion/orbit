import 'raf/polyfill'
import { Logger } from '@mcro/logger'
import waitPort from 'wait-port'
import { Electron } from '@mcro/stores'
import { OrbitRoot } from './orbit/OrbitRoot'
import * as React from 'react'
import { render } from '@mcro/reactron'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import { ChromeRoot } from './chrome/ChromeRoot'

const log = new Logger(process.env.SUB_PROCESS || 'electron')

export async function main() {
  log.info(`Starting electron in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    // in any electron process...
    require('source-map-support/register')
    require('./helpers/installGlobals')
    console.log('Waiting for dev ports')
    await Promise.all[(waitPort({ port: 3999 }), waitPort({ port: 3001 }))]

    if (!process.env.SUB_PROCESS) {
      // only in main electron process...
      require('./helpers/monitorResourceUsage')
      require('./helpers/watchForAppRestarts').watchForAppRestarts()
    }
  }

  // why not make it a bit easier in prod mode too
  electronContextMenu()
  electronDebug()

  // start Electron state store
  await Electron.start()

  //
  // START THE PROCESSES
  //

  if (process.env.SUB_PROCESS === 'electron-chrome') {
    // electron-chrome
    render(<ChromeRoot />)
  } else {
    // electron
    require('./helpers/updateChecker')
    render(<OrbitRoot />)
  }
}
