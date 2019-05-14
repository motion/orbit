import 'raf/polyfill'

import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, WebSocketServerTransport } from '@o/mediator'
import { AppOpenWindowCommand, CloseAppCommand, NewFallbackServerPortCommand, RestartAppCommand, SendClientDataCommand, TearAppCommand } from '@o/models'
import { render } from '@o/reactron'
import { Electron } from '@o/stores'
import { sleep } from '@o/utils'
import electronDebug from 'electron-debug'
import * as React from 'react'
import waitOn from 'wait-on'
import waitPort from 'wait-port'

import { IS_MAIN_ORBIT } from './constants'
import ElectronRoot from './ElectronRoot'
import { forkAndStartOrbitApp } from './helpers/forkAndStartOrbitApp'
import MenuWindow from './menus/MenuWindow'
import { OrbitRoot } from './orbit/OrbitRoot'
import { CloseAppResolver } from './resolver/CloseAppResolver'
import { RestartAppResolver } from './resolver/RestartAppResolver'
import { TearAppResolver } from './resolver/TearAppResolver'

const log = new Logger(process.env.SUB_PROCESS || 'electron')

export async function main() {
  const desktopServerUrl = `http://localhost:${getGlobalConfig().ports.server}`

  log.info(
    `Starting electron in env ${process.env.NODE_ENV}`,
    `Waiting on desktop port: ${desktopServerUrl}`,
    `IS_MAIN_ORBIT: ${IS_MAIN_ORBIT}`,
  )

  await waitOn({ resources: [desktopServerUrl], interval: 50 })

  // we can have a different mediator if we want for child windows
  if (IS_MAIN_ORBIT) {
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

    // require after desktop starts to avoid reconnect errors
    const { Mediator } = require('./mediator')
    const port = await Mediator.command(NewFallbackServerPortCommand)
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
                appId,
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
  }

  if (process.env.NODE_ENV === 'development') {
    // in any electron process...
    require('source-map-support/register')
    require('./helpers/installGlobals')
    require('./helpers/monitorResourceUsage')
    await Promise.all[(waitPort({ port: 3999 }), waitPort({ port: 3001 }))]
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

  if (process.env.SINGLE_APP_MODE) {
    console.log('Running from cli, wait to start up the main process for a bit for speed')
    await sleep(3000)
  }

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
