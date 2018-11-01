import 'raf/polyfill'
import { Logger } from '@mcro/logger'
import waitPort from 'wait-port'
import { Electron } from '@mcro/stores'
import { ElectronRoot } from './views/ElectronRoot'
import * as React from 'react'
import { render } from '@mcro/reactron'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import { ChromeWindow } from './views/ChromeWindow'
import { App } from '@mcro/reactron'
import { devTools } from './helpers/devTools'

const log = new Logger('electron')

Error.stackTraceLimit = Infinity

export async function main(): Promise<number | void> {
  log.info(`Starting electron in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    // in any electron process...
    require('source-map-support/register')
    require('./helpers/installGlobals')
    if (process.env.SUB_PROCESS) {
      return
    }

    // only in main electron process...
    require('./helpers/monitorResourceUsage')
    require('./helpers/watchForAppRestarts').watchForAppRestarts()
    console.log('Waiting for dev ports')
    await Promise.all[(waitPort({ port: 3999 }), waitPort({ port: 3001 }))]
  }

  // why not make it a bit easier in prod mode too
  electronContextMenu()
  electronDebug()

  if (process.env.SUB_PROCESS === 'electron-chrome') {
    render(
      <App onWillQuit={() => require('global').handleExit()} devTools={devTools}>
        <ChromeWindow />
      </App>,
    )
    return
  }

  // dont need to sync state with ourselves, only one Electron process
  await Electron.start({
    ignoreSelf: true,
  })

  require('./helpers/updateChecker')

  render(<ElectronRoot />)
}
