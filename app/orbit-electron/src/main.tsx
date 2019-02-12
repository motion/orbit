import { Logger } from '@mcro/logger'
import { render } from '@mcro/reactron'
import { CloseAppCommand, TearAppCommand } from '@mcro/models'
import { Electron } from '@mcro/stores'
import electronDebug from 'electron-debug'
import 'raf/polyfill'
import * as React from 'react'
import waitPort from 'wait-port'
import AppsWindow from './apps/AppsWindow'
import { IS_SUB_ORBIT } from './constants'
import ElectronRoot from './ElectronRoot'
import MenuWindow from './menus/MenuWindow'
import { OrbitRoot } from './orbit/OrbitRoot'
import { MediatorServer, WebSocketServerTransport } from '@mcro/mediator'
import { getGlobalConfig } from '@mcro/config'
import { TearAppResolver } from './resolver/TearAppResolver'
import { CloseAppResolver } from './resolver/CloseAppResolver'

const log = new Logger(process.env.SUB_PROCESS || 'electron')

export async function main() {
  log.info(`Starting electron in env ${process.env.NODE_ENV}`)

  const mediatorServer = new MediatorServer({
    models: [],
    commands: [TearAppCommand, CloseAppCommand],
    transport: new WebSocketServerTransport({
      port: getGlobalConfig().ports.electronMediator,
    }),
    resolvers: [
      TearAppResolver,
      CloseAppResolver,
    ],
  })
  mediatorServer.bootstrap()

  // handle our own separate process in development
  if (!IS_SUB_ORBIT && process.env.NODE_ENV === 'development') {
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
