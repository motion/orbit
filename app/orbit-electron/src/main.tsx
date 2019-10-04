import 'raf/polyfill'

import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, WebSocketServerTransport } from '@o/mediator'
import { NewFallbackServerPortCommand, SendClientDataCommand, ToggleOrbitMainCommand } from '@o/models'
import { render } from '@o/reactron'
import { Electron } from '@o/stores'
import { stringHash } from '@o/ui'
import { BrowserWindow } from 'electron'
import electronDebug from 'electron-debug'
import { writeFileSync } from 'fs'
import { join } from 'path'
import * as React from 'react'
import waitOn from 'wait-on'

import { IS_MAIN_ORBIT } from './constants'
import ElectronRoot from './ElectronRoot'
import { ToggleOrbitActionsResolver } from './OrbitActionsAppWindow'
import { OrbitChromeWindow } from './OrbitChromeWindow'
import { OrbitRoot } from './OrbitRoot'
import { AppCloseWindowResolver } from './resolver/AppCloseWindowResolver'
import { AppOpenWindowResolver } from './resolver/AppOpenWindowResolver'
import { RestartAppResolver } from './resolver/RestartAppResolver'
import { TearAppResolver } from './resolver/TearAppResolver'

const log = new Logger(process.env.SUB_PROCESS || 'electron')

export async function main(loadingWindow?: BrowserWindow) {
  const desktopServerUrl = `http://localhost:${getGlobalConfig().ports.server}/hello`

  log.info(
    `Starting electron in env ${process.env.NODE_ENV}`,
    `Waiting on desktop port: ${desktopServerUrl}`,
    `IS_MAIN_ORBIT: ${IS_MAIN_ORBIT}`,
  )

  await waitOn({ resources: [desktopServerUrl], interval: 30 })

  // start Electron state store
  await Electron.start({
    waitForInitialState: false,
  })

  // we can have a different mediator if we want for child windows
  if (IS_MAIN_ORBIT) {
    // register app schema
    const { app } = require('electron')

    // start shortcuts listening on main process
    require('./stores/OrbitShortcutsStore')

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

    // drag/drop test
    const { ipcMain, nativeImage } = require('electron')
    ipcMain.on('ondragstart', (event, data) => {
      const filename = `drop-${stringHash(data.slice(0, 100))}.json`
      const filepath = join(getGlobalConfig().paths.temp, filename)
      writeFileSync(filepath, data)
      event.sender.startDrag({
        // todo write json to a tmp file
        file: filepath,
        icon: nativeImage.createFromPath('/Users/nw/Desktop/desktop/swiftui.png'),
      })
    })

    // require after desktop starts to avoid reconnect errors
    const { Mediator } = require('./mediator')
    const port = await Mediator.command(NewFallbackServerPortCommand)
    const mediatorServer = new MediatorServer({
      models: [],
      transport: new WebSocketServerTransport({ port }),
      resolvers: [
        AppOpenWindowResolver,
        AppCloseWindowResolver,
        TearAppResolver,
        RestartAppResolver,
        ToggleOrbitActionsResolver,

        resolveCommand(ToggleOrbitMainCommand, async next => {
          const showOrbitMain = typeof next === 'boolean' ? next : !Electron.state.showOrbitMain
          Electron.setState({ showOrbitMain })
        }),
      ],
    })

    mediatorServer.bootstrap()
  }

  if (process.env.NODE_ENV === 'development') {
    // in any electron process...
    require('source-map-support/register')
    require('./helpers/installGlobals')
    require('./helpers/monitorResourceUsage')
  }

  // why not make it a bit easier in prod mode too
  electronDebug()

  //
  // START THE PROCESSES
  //

  switch (process.env.SUB_PROCESS) {
    case 'electron-chrome':
      render(
        <ElectronRoot>
          <OrbitChromeWindow />
        </ElectronRoot>,
      )
      return
    default:
      require('./helpers/updateChecker')
      render(<OrbitRoot loadingWindow={loadingWindow} />)
  }
}
