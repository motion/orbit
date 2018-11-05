import { App, Electron } from '@mcro/stores'
import { store } from '@mcro/black'
import { app, clipboard } from 'electron'
import { ShortcutsStore } from './ShortcutsStore'

@store
export class OrbitStore {
  shortcutStore = new ShortcutsStore()

  async didMount() {
    this.shortcutStore.onShortcut(this.onShortcut)
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

  onShortcut = async shortcut => {
    console.log('shortcut', shortcut)
    if (shortcut === 'Option+Space') {
      this.toggleDocked()
      return
    }
  }

  toggleDocked = async () => {
    const shown = App.orbitState.docked
    Electron.sendMessage(App, shown ? App.messages.HIDE : App.messages.SHOW)
  }

  restart() {
    if (process.env.NODE_ENV === 'development') {
      require('touch')(require('path').join(__dirname, '..', '..', '_', 'main.js'))
    }
  }
}
