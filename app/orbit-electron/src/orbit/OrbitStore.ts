import { App, Electron } from '@mcro/stores'
import { isEqual, store, on } from '@mcro/black'
import { app, screen, clipboard } from 'electron'
import { ShortcutsStore } from './ShortcutsStore'
import { HoverStateStore } from './HoverStateStore'

@store
export class OrbitStore {
  shortcutStore = new ShortcutsStore()
  hoverStateStore = new HoverStateStore()

  async didMount() {
    this.followMousePosition()
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

  followMousePosition = () => {
    let lastPoint
    on(
      this,
      setInterval(() => {
        const nextPoint = screen.getCursorScreenPoint()
        if (!isEqual(nextPoint, lastPoint)) {
          lastPoint = nextPoint
          this.hoverStateStore.handleMousePosition(nextPoint)
        }
      }, 40),
    )
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
