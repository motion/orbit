import 'raf/polyfill'
import { setConfig } from './config'
import * as Path from 'path'
import { logger } from '@mcro/logger'
import waitPort from 'wait-port'
import { startDesktopInProcess } from './helpers/startDesktopInProcess'
import { app, dialog } from 'electron'

const log = logger('electron')

Error.stackTraceLimit = Infinity

export async function main({
  port,
  handleExit = null,
}): Promise<number | void> {
  log(`Starting electron with port ${port} in env ${process.env.NODE_ENV}`)

  // handle our own separate process in development
  if (process.env.NODE_ENV === 'development') {
    require('source-map-support/register')
    require('./helpers/installGlobals')
    require('./helpers/watchForAppRestarts').watchForAppRestarts()
    await waitPort({ port: 3002 })
    await waitPort({ port: 3001 })
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

  let desktopPid

  // PRODUCTION
  if (process.env.NODE_ENV !== 'development') {
    if (handleExit) {
      app.on('before-quit', () => {
        console.log('Electron handle exit...')
        handleExit()
      })
    }

    // start desktop...

    // fail message
    let desktopFailMsg = ''
    const failStartTm = setTimeout(() => {
      dialog.showMessageBox({
        message: `Node process didnt start: ${desktopFailMsg}`,
        buttons: ['Ok'],
      })
    }, 5000)

    log('In production, starting desktop...')
    try {
      desktopPid = startDesktopInProcess(port)
      console.log('>>>>>>> desktop pid is', desktopPid)
    } catch (err) {
      desktopFailMsg = `${err.message}`
    }

    log('Waiting for desktop startup to continue...')
    await waitPort({ port })
    clearTimeout(failStartTm)
    log('Found desktop, continue...')

    // move to app folder
    if (!app.isInApplicationsFolder()) {
      app.dock.bounce('informational')
      const response = dialog.showMessageBox({
        type: 'question',
        title: 'Move to apps?',
        message: 'Move Orbit to Applications folder?',
        buttons: ['Cancel', 'Ok'],
        defaultId: 1,
        cancelId: 0,
      })
      if (response === 1) {
        try {
          app.moveToApplicationsFolder()
        } catch (err) {
          console.log('error moving to app folder', err)
        }
      }
    }
  }

  // set config before starting app
  setConfig({
    env: {
      prod: process.env.NODE_ENV !== 'development',
    },
    server: {
      url: `http://localhost:${port}`,
      host: 'localhost',
      port,
    },
    directories: {
      root: Path.join(__dirname, '..'),
    },
  })

  // require app after setting config
  const { ElectronApp } = require('./ElectronApp')
  new ElectronApp()

  return desktopPid
}
