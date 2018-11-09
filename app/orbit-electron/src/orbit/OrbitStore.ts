import { Electron } from '@mcro/stores'
import { store } from '@mcro/black'
import { app, clipboard } from 'electron'
import { ShortcutsManager } from './ShortcutsManager'

@store
export class OrbitStore {
  shortcutManager = new ShortcutsManager()

  async didMount() {
    Electron.onMessage(msg => {
      switch (msg) {
        case Electron.messages.COPY:
          clipboard.writeText(msg)
          return
        case Electron.messages.RESTART:
          app.relaunch()
          app.exit()
          return
      }
    })
  }

  restart() {
    if (process.env.NODE_ENV === 'development') {
      require('touch')(require('path').join(__dirname, '..', '..', '_', 'main.js'))
    }
  }
}
