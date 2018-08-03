import './helpers/monitorResourceUsage'
import './helpers/handlePromiseErrors'
import './helpers/updateChecker'
import electronContextMenu from 'electron-context-menu'
import electronDebug from 'electron-debug'
import React from 'react'
import { render } from '@mcro/reactron'
import { watchForAppRestarts } from './helpers/watchForAppRestarts'
import { Electron } from '@mcro/stores'
import { ElectronRoot } from './views/ElectronRoot'

export class ElectronApp {
  constructor() {
    this.handleExit()
    watchForAppRestarts()
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

  handleExit() {
    const exitHandler = code => process.exit(code)
    // dont close instantly
    process.stdin.resume()
    // do something when app is closing
    process.on('exit', exitHandler)
    process.on('SIGINT', () => exitHandler(0))
    process.on('SIGUSR1', () => exitHandler(0))
    process.on('SIGUSR2', () => exitHandler(0))
    process.on('uncaughtException', err => {
      console.log('uncaughtException', err.stack)
    })
  }
}
