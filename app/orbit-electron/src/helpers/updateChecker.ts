import updater from 'electron-simple-updater'
import { getConfig } from '../config'
import { getGlobalConfig } from '@mcro/config'

const UPDATE_PREFIX = '\n\n\n\nELECTRON UPDATE\n\n\n'

console.log('Update checker... is prod?', getConfig().env.prod)

// update checker
if (getConfig().env.prod) {
  updater.init({
    version: getGlobalConfig().version,
    url: 'http://get.tryorbit.com/updates/updates.json',
  })

  updater.on('update-available', () => {
    console.log(UPDATE_PREFIX, 'Update available')
  })

  updater.on('update-downloaded', meta => {
    console.log(UPDATE_PREFIX, 'Update downloaded, quit and install', meta)
    updater.quitAndInstall()
  })
}
