// @ts-ignore
import { app, dialog } from 'electron'
import { cleanupChildren } from './cleanupChildren'
import waitPort from 'wait-port'
import { log } from './log'
import { getGlobalConfig } from '@mcro/config'
import { ChildProcess } from 'child_process'

export async function startElectron() {
  const Config = getGlobalConfig()

  // else, electron...
  let desktopProcess: ChildProcess

  app.on('before-quit', async () => {
    console.log('Electron handle exit...')
    console.log('Orbit exiting...')
    cleanupChildren(desktopProcess.pid)
    cleanupChildren(process.pid)
    desktopProcess.kill('SIGINT')
    // actually kills it https://azimi.me/2014/12/31/kill-child_process-node-js.html
    process.kill(-desktopProcess.pid)
    console.log('bye!')
  })

  // fork desktop process...
  // fail message
  let desktopFailMsg = ''
  const failStartTm = setTimeout(() => {
    dialog.showMessageBox({
      message: `Node process didnt start: ${desktopFailMsg}`,
      buttons: ['Ok'],
    })
  }, 10000)

  try {
    desktopProcess = require('./startDesktop').startDesktop()
  } catch (err) {
    desktopFailMsg = `${err.message}`
  }

  log('Waiting for desktop startup to continue...')
  await waitPort({ port: Config.ports.server })
  clearTimeout(failStartTm)
  log('Found desktop, continue...')

  // start electron...
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main()

  // PRODUCTION
  if (Config.isProd) {
    // move to app folder
    if (!app.isInApplicationsFolder()) {
      app.focus()
      app.dock.bounce('informational')
      const response = dialog.showMessageBox({
        type: 'question',
        title: 'Move to apps?',
        message: 'Move Orbit to Applications folder?',
        buttons: ['Ok', 'Cancel'],
        defaultId: 0,
        cancelId: 1,
      })
      if (response === 0) {
        try {
          app.moveToApplicationsFolder()
        } catch (err) {
          console.log('error moving to app folder', err)
        }
      }
    }
  }
}
