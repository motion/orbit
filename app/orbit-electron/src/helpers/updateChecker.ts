import updater from 'electron-simple-updater'
import { getConfig } from '../config'

console.log('Update checker... is prod?', getConfig().env.prod)

// update checker
if (getConfig().env.prod) {
  const updateUrl = 'http://138.68.15.104/updates/update.json'
  updater.init(updateUrl)

  updater.on('update-available', () => {
    console.log('Update available')
  })

  updater.on('update-downloaded', () => {
    console.log('Update downloaded, quit and install')
    updater.quitAndInstall()
  })
}
