import { App, Electron, Desktop } from '@mcro/stores'
import { isEqual, store, debugState, on, react, ensure, sleep } from '@mcro/black'
import { ShortcutsStore } from './ShortcutsStore'
import { HoverStateStore } from './HoverStateStore'
import root from 'global'
import { app, screen, clipboard } from 'electron'
import { Logger } from '@mcro/logger'

const log = new Logger('ElectronStore')

// @ts-ignore
@store
export class ElectronStore {
  // = null makes them observable
  shortcutStore?: ShortcutsStore = null
  hoverStateStore?: HoverStateStore = null
  error = null
  appRef = null
  stores = null
  views = null
  clear = Date.now()
  show = 2
  apps = new Set()

  async didMount() {
    root.Root = this
    root.restart = this.restart
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
    this.shortcutStore = new ShortcutsStore()
    this.hoverStateStore = new HoverStateStore()
    this.followMousePosition()
    this.shortcutStore.onShortcut(this.onShortcut)
    Electron.onMessage(msg => {
      switch (msg) {
        case Electron.messages.COPY:
          clipboard.writeText(msg)
          return
        case Electron.messages.CLEAR:
          this.clear = Date.now()
          return
          return
        case Electron.messages.RESTART:
          app.relaunch()
          app.exit()
          return
      }
    })
  }

  async reset() {
    log.info('Resetting...')
    this.show = 0
    await sleep(1)
    this.show = 2
  }

  closeOnAppClose = react(
    () => Desktop.orbitFocusState,
    state => {
      ensure('exited', state.exited)
      if (state.exited) {
        process.exit(0)
      }
    },
  )

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

  togglePinned = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_PINNED)
  }

  restart() {
    if (process.env.NODE_ENV === 'development') {
      require('touch')(require('path').join(__dirname, '..', '..', '_', 'main.js'))
    }
  }

  handleAppRef = ref => {
    if (!ref) return
    this.appRef = ref.app
    // this.appRef.dock.hide()
  }

  handleBeforeQuit = () => {
    console.log('before quit electron...')
  }

  handleQuit = () => {
    console.log('handling quit...')
    root.handleExit()
  }
}
