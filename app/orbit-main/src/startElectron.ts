import { getGlobalConfig } from '@o/config'
import { app, dialog } from 'electron'
import { handleExit } from './helpers/handleExit'

export function startElectron({ mainProcess }) {
  if (mainProcess) {
    // this works in prod
    app.on('before-quit', handleExit)

    if (app.isReady) {
      console.log('app already ready')
      finishLaunchingElectron({ mainProcess })
    } else {
      app.on('ready', finishLaunchingElectron)
    }
  } else {
    finishLaunchingElectron({ mainProcess })
  }
}

const finishLaunchingElectron = async ({ mainProcess }) => {
  // electron white bg fix attempt:
  // https://github.com/electron/electron/issues/2170#issuecomment-372108061
  // await new Promise(res => setTimeout(res, 100))

  const Config = getGlobalConfig()
  // start electron...
  const ElectronApp = require('@o/orbit-electron')
  ElectronApp.main()

  // PRODUCTION
  if (mainProcess && Config.isProd) {
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
