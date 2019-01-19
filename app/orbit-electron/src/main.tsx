import { Logger } from '@mcro/logger'
import { render } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import 'raf/polyfill'
import * as React from 'react'
import waitPort from 'wait-port'
import AppsWindow from './apps/AppsWindow'
import ElectronRoot from './ElectronRoot'
import MenuWindow from './menus/MenuWindow'
import { OrbitRoot } from './orbit/OrbitRoot'

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

    if (process.env.SUB_PROCESS) {
      // hide sub-process docks
      require('electron').app.dock.hide()
    } else {
      // only in main electron process...
      require('./helpers/monitorResourceUsage')
    }
  }

  // why not make it a bit easier in prod mode too
  electronContextMenu()
  electronDebug()

  // start Electron state store
  await Electron.start({
    waitForInitialState: false,
  })

  //
  // START THE PROCESSES
  //

  switch (process.env.SUB_PROCESS) {
    case 'electron-menus':
      render(
        <ElectronRoot>
          <MenuWindow />
        </ElectronRoot>,
      )
      return
    case 'electron-apps':
      render(
        <ElectronRoot>
          <AppsWindow />
        </ElectronRoot>,
      )
      return
    default:
      require('./helpers/updateChecker')
      render(<OrbitRoot />)
  }
}
