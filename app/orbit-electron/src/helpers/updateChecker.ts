import updater from 'electron-simple-updater'
import { getGlobalConfig } from '@mcro/config'
import { Notification } from 'electron'

const UPDATE_PREFIX = '\n\n\n\nELECTRON UPDATE\n\n\n'

// update checker
if (getGlobalConfig().isProd) {
  updater.init({
    version: getGlobalConfig().version,
    url: 'http://get.tryorbit.com/updates/updates.json',
  })

  updater.on('update-available', () => {
    console.log(UPDATE_PREFIX, 'Update available')
  })

  updater.on('update-downloaded', meta => {
    console.log(UPDATE_PREFIX, 'Update downloaded, quit and install', meta)
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: 'Orbit has an update',
        body: 'Click restart to install.',
        actions: [
          { type: 'button', text: 'Accept' },
          { type: 'button', text: 'Later' },
        ],
      })

      try {
        // @ts-ignore
        notification.on('action', ({ index }) => {
          if (index === 0) {
            updater.quitAndInstall()
          }
        })
      } catch (err) {
        console.log('do ti anyway on err', err)
        updater.quitAndInstall()
      }
    } else {
      updater.quitAndInstall()
    }
  })
}
