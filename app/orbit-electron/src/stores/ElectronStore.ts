import { App, Electron, Desktop } from '@mcro/stores'
import { isEqual, store, react, debugState, on, sleep } from '@mcro/black'
import { ShortcutsStore } from './ShortcutsStore'
import { WindowFocusStore } from '../stores/WindowFocusStore'
import { HoverStateStore } from '../stores/HoverStateStore'
import root from 'global'
import { screen } from 'electron'

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
  orbitRef = null
  clear = Date.now()
  show = 2

  async didMount() {
    root.Root = this
    root.restart = this.restart
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
    this.windowFocusStore = new WindowFocusStore()
    this.shortcutStore = new ShortcutsStore(['Option+Space'])
    this.hoverStateStore = new HoverStateStore()
    this.followMousePosition()
    this.shortcutStore.onShortcut(this.onShortcut)
    Electron.onMessage(msg => {
      switch (msg) {
        case Electron.messages.CLEAR:
          this.clear = Date.now()
          return
        case Electron.messages.DEFOCUS:
          this.windowFocusStore.defocusOrbit()
          return
        case Electron.messages.FOCUS:
          this.windowFocusStore.focusOrbit()
          return
      }
    })
    Electron.onClear = () => {
      // log(`Electron.onClear`)
      this.clear = Date.now()
    }
    // clear to start
    Electron.onClear()
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
    // if (shortcut === 'Option+Space') {
    //   if (App.orbitState.hidden) {
    //     this.toggleVisible()
    //     Electron.sendMessage(App, App.messages.PIN)
    //     return
    //   }
    //   if (App.orbitState.pinned) {
    //     Electron.sendMessage(Desktop, Desktop.messages.CLEAR_OPTION)
    //     Electron.sendMessage(App, App.messages.HIDE)
    //     Electron.sendMessage(App, App.messages.UNPIN)
    //     return
    //   } else {
    //     // !pinned
    //     this.togglePinned()
    //   }
    // }
  }

  toggleDocked = async () => {
    console.log('toggling docked')
    if (!App.orbitState.docked) {
      this.windowFocusStore.focusOrbit()
    } else {
      this.windowFocusStore.defocusOrbit()
    }
    await sleep(40)
    Electron.sendMessage(App, App.messages.TOGGLE_DOCKED)
  }

  toggleVisible = () => {
    if (App.orbitState.hidden) {
      Electron.sendMessage(App, App.messages.HIDE)
    } else {
      Electron.sendMessage(App, App.messages.SHOW)
    }
  }

  togglePinned = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_PINNED)
  }

  clearApp = react(
    () => this.clear,
    async (_, { when, sleep }) => {
      if (!this.appRef) {
        throw react.cancel
      }
      this.appRef.hide()
      const getState = () => ({
        ...Desktop.appState,
        ...App.state.orbitState,
      })
      const lastState = getState()
      this.show = 0
      Electron.sendMessage(App, App.messages.HIDE)
      await when(() => !App.isShowingOrbit) // ensure hidden
      await when(() => !isEqual(getState(), lastState)) // ensure moved
      this.show = 1 // now render with 0 opacity so chrome updates visuals
      await sleep(50) // likely not necessary, ensure its ready for app show
      this.appRef.show() // downstream apps should now be hidden
      await sleep(200) // finish rendering, could be a when(() => App.isRepositioned)
      await when(() => !Desktop.mouseState.mouseDown) // ensure not moving window
      this.show = 2
    },
  )

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
      require('touch')(require('path').join(__dirname, '..', 'index.js'))
    }
  }

  handleAppRef = ref => {
    if (!ref) return
    this.appRef = ref.app
    // this.appRef.dock.hide()
  }
  handleBeforeQuit = () => console.log('before quit')
  handleQuit = () => {
    process.exit(0)
  }
}
