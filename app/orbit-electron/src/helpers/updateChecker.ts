import updater from 'electron-simple-updater'
import { getConfig } from '../config'
import { getConfig as getGlobalConfig } from '@mcro/config'

const UPDATE_PREFIX = '\n\n\n\nELECTRON UPDATE\n\n\n'

console.log('Update checker... is prod?', getConfig().env.prod)

// update checker
if (getConfig().env.prod) {
  updater.init({
    version: getGlobalConfig().version,
    url: 'http://138.68.15.104/updates/updates.json',
  })

  updater.on('update-available', () => {
    console.log(UPDATE_PREFIX, 'Update available')
  })

  updater.on('update-downloaded', meta => {
    console.log(UPDATE_PREFIX, 'Update downloaded, quit and install', meta)
    updater.quitAndInstall()
  })
}
