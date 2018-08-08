import updater from 'electron-simple-updater'
import { getConfig } from '../config'

// update checker
if (getConfig().env.prod) {
  const updateUrl = require('../../package.json').updater.url
  console.log('updateUrl', updateUrl)
  updater.init(updateUrl)

  updater.on('update-available', () => {
    console.log('Update available')
  })

  updater.on('update-downloaded', () => {
    console.log('Update downloaded, quit and install')
    updater.quitAndInstall()
  })
}
