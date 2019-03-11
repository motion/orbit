import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Electron } from '@o/stores'
import { app } from 'electron'
import logger from 'electron-log'
import { autoUpdater } from 'electron-updater'

const log = new Logger('updateChecked')

// update checker
if (getGlobalConfig().isProd) {
  autoUpdater.logger = logger
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('download-progress', ({ percent }) => {
    log.info(`Download update ${percent}`)
    Electron.setState({
      updateState: {
        percent,
        downloading: true,
      },
    })
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded, restarting...')
    // wait a second
    setTimeout(() => {
      app.relaunch()
    }, 1000)
  })
}
