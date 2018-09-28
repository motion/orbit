import { app, dialog } from 'electron'
import waitPort from 'wait-port'
import { log } from './log'
import { getGlobalConfig } from '@mcro/config'
import { handleExit } from './handleExit'

export async function startElectron() {
  const Config = getGlobalConfig()

  // this works in prod
  app.on('before-quit', handleExit)

  log.info('Waiting for desktop startup to continue...')
  await waitPort({ port: Config.ports.server })
  log.info('Found desktop, continue...')

  // start electron...
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main()

  // focus app on start
  // because we hide dock icon we need to do this
  if (process.env.NODE_ENV !== 'development') {
    app.focus()
  }

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
