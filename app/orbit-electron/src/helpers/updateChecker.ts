import { autoUpdater } from 'electron-updater'
import { getGlobalConfig } from '@mcro/config'
import logger from 'electron-log'

// update checker
if (getGlobalConfig().isProd) {
  autoUpdater.logger = logger
  autoUpdater.checkForUpdatesAndNotify()
}
