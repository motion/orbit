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
  constructor() {
    this.handleExit()
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
}
