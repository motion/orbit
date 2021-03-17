import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { app, dialog } from 'electron'

import { handleExit } from './helpers/handleExit'

const log = new Logger('startElectron')

export function startElectron({ mainProcess, loadingWindow }) {
  if (mainProcess) {
    // this works in prod
    app.on('before-quit', () => {
      log.info('before-quit')
      handleExit()
    })

    if (app.isReady) {
      finishLaunchingElectron({ mainProcess, loadingWindow })
    } else {
      // @ts-ignore
      app.on('ready', finishLaunchingElectron)
    }
  } else {
    finishLaunchingElectron({ mainProcess, loadingWindow })
  }
}

const finishLaunchingElectron = async ({ mainProcess, loadingWindow }) => {
  const Config = getGlobalConfig()

  // start electron...
  const ElectronApp = require('@o/orbit-electron')
  ElectronApp.main(loadingWindow)

  // PRODUCTION
  if (
    mainProcess &&
    Config.isProd &&
    !process.env.SINGLE_USE_MODE &&
    !process.env.NO_MOVE_TO_APPS
  ) {
    // wait a sec
    await new Promise(res => setTimeout(res, 1000))
    // move to app folder
    if (!app.isInApplicationsFolder()) {
      app.dock.bounce('informational')
      const { response } = await dialog.showMessageBox({
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
