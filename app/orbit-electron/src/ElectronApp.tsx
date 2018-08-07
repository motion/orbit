import './helpers/monitorResourceUsage'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { ElectronRoot } from './views/ElectronRoot'

export class ElectronApp {
  port: number

  constructor({ port }) {
    this.port = port
    electronContextMenu()
    electronDebug()
    this.startApp()
  }

  async startApp() {
    await Electron.start({
      ignoreSelf: true,
    })
    render(<ElectronRoot />)
  }
}
