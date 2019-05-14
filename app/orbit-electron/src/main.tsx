import 'raf/polyfill'

import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, WebSocketServerTransport } from '@o/mediator'
import { AppOpenWindowCommand, CloseAppCommand, NewFallbackServerPortCommand, RestartAppCommand, SendClientDataCommand, TearAppCommand } from '@o/models'
import { render } from '@o/reactron'
import { Electron } from '@o/stores'
import electronDebug from 'electron-debug'
import * as React from 'react'
import waitOn from 'wait-on'
import waitPort from 'wait-port'

import { IS_SUB_ORBIT } from './constants'
import ElectronRoot from './ElectronRoot'
import { forkAndStartOrbitApp } from './helpers/forkAndStartOrbitApp'
import MenuWindow from './menus/MenuWindow'
import { OrbitRoot } from './orbit/OrbitRoot'
import { CloseAppResolver } from './resolver/CloseAppResolver'
import { RestartAppResolver } from './resolver/RestartAppResolver'
import { TearAppResolver } from './resolver/TearAppResolver'

const log = new Logger(process.env.SUB_PROCESS || 'electron')

export async function main() {
  log.info(`Starting electron in env ${process.env.NODE_ENV}`)

  const desktopServerUrl = `http://localhost:${getGlobalConfig().ports.server}`
  console.log('Waiting on desktop port', desktopServerUrl, '...')
  await waitOn({ resources: [desktopServerUrl], interval: 50 })
  console.log('Connected to desktop')

  // require after desktop starts to avoid reconnect errors
  const { Mediator } = require('./mediator')
  const port = await Mediator.command(NewFallbackServerPortCommand)
  console.log('Electron started mediator on port', port)

  const mediatorServer = new MediatorServer({
    models: [],
    commands: [AppOpenWindowCommand, TearAppCommand, CloseAppCommand, RestartAppCommand],
    transport: new WebSocketServerTransport({ port }),
    resolvers: [
      resolveCommand(AppOpenWindowCommand, async ({ appId, isEditing }) => {
        console.log('got open window command, opening...', appId)
        Electron.setState({
          appWindows: {
            [appId]: {
              type: 'root',
              id: appId,
              isEditing: !!isEditing,
            },
          },
        })
        // setTimeout so command doesnt take forever to run
        setTimeout(() => {
          forkAndStartOrbitApp({ appId })
        })
        return true
      }),
      TearAppResolver,
      CloseAppResolver,
      RestartAppResolver,
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
    console.log('Waiting for dev ports done')

    if (process.env.SUB_PROCESS) {
      // hide sub-process docks
      require('electron').app.dock.hide()
    } else {
      // only in main electron process...
      require('./helpers/monitorResourceUsage')

      // register app schema
      const { app } = require('electron')
      if (app.isDefaultProtocolClient('orbit') === false) {
        app.setAsDefaultProtocolClient('orbit')
      }
      app.on('open-url', (_options, path) => {
        console.log(`open-url emitted`, path)
        Mediator.command(SendClientDataCommand, {
          name: 'APP_URL_OPENED',
          value: path.replace('orbit://', ''),
        })
      })
    }
  }

  // why not make it a bit easier in prod mode too
  electronDebug()

  // start Electron state store
  console.log('Starting Electron store')
  await Electron.start({
    waitForInitialState: false,
  })
  console.log('Started Electron store')

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
    default:
      require('./helpers/updateChecker')
      render(<OrbitRoot />)
  }
}
