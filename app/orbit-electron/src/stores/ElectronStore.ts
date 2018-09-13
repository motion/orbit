import { App, Electron } from '@mcro/stores'
import { isEqual, store, react, debugState, on } from '@mcro/black'
import { ShortcutsStore } from './ShortcutsStore'
import { WindowFocusStore } from './WindowFocusStore'
import { HoverStateStore } from './HoverStateStore'
import root from 'global'
import { app, screen, clipboard } from 'electron'

// @ts-ignore
@store
export class ElectronStore {
  // = null makes them observable
  shortcutStore?: ShortcutsStore = null
  windowFocusStore?: WindowFocusStore = null
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
    this.windowFocusStore = new WindowFocusStore()
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
        case Electron.messages.FOCUS:
          this.windowFocusStore.focusOrbit()
          return
        case Electron.messages.RESTART:
          app.relaunch()
          app.exit()
          return
      }
    })
  }

  get orbitRef() {
    return this.windowFocusStore.orbitRef
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
    console.log('toggling docked')
    if (!shown) {
      this.windowFocusStore.focusOrbit()
    }
    Electron.sendMessage(App, shown ? App.messages.HIDE : App.messages.SHOW)
  }

  togglePinned = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_PINNED)
  }

  // clearApp = react(
  //   () => this.clear,
  //   async (_, { when, sleep }) => {
  //     ensure('has app ref', !!this.appRef)
  //     this.appRef.hide()
  //     const getState = () => ({
  //       ...Desktop.appState,
  //       ...App.state.orbitState,
  //     })
  //     const lastState = getState()
  //     this.show = 0
  //     Electron.sendMessage(App, App.messages.HIDE)
  //     await when(() => !App.isShowingOrbit) // ensure hidden
  //     await when(() => !isEqual(getState(), lastState)) // ensure moved
  //     this.show = 1 // now render with 0 opacity so chrome updates visuals
  //     await sleep(50) // likely not necessary, ensure its ready for app show
  //     this.appRef.show() // downstream apps should now be hidden
  //     await sleep(200) // finish rendering, could be a when(() => App.isRepositioned)
  //     await when(() => !Desktop.mouseState.mouseDown) // ensure not moving window
  //     this.show = 2
  //   },
  //   { deferFirstRun: true },
  // )

  // focus on pinned
  focusOnPin = react(
    () => App.orbitState.pinned,
    pinned => {
      // only focus on option+space
      if (Electron.lastAction !== 'Option+Space') {
        return
      }
      if (pinned) {
        this.appRef.focus()
      }
    },
    { delay: App.animationDuration },
  )

  restart() {
    if (process.env.NODE_ENV === 'development') {
      require('touch')(require('path').join(__dirname, '..', '..', 'package.json'))
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
    process.exit(0)
  }
}
