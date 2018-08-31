// @ts-ignore
import { app, dialog } from 'electron'
import { cleanupChildren } from './cleanupChildren'
import waitPort from 'wait-port'
import { log } from './log'
import { getGlobalConfig } from '@mcro/config'

export async function startElectron() {
  const Config = getGlobalConfig()

  // else, electron...
  let desktopProcess
  const handleExit = async () => {
    console.log('Orbit exiting...')
    if (desktopProcess) {
      desktopProcess.kill('SIGINT')
    }
    await cleanupChildren()
    console.log('bye!')
  }

  app.on('before-quit', () => {
    console.log('Electron handle exit...')
    handleExit()
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
    console.log('>>>>>>> desktop pid is', desktopProcess)
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
