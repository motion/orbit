import { autoUpdater } from 'electron-updater'
import { getGlobalConfig } from '@mcro/config'
import logger from 'electron-log'
import { Electron } from '@mcro/stores'
import { app } from 'electron'
import { Logger } from '@mcro/logger'

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
