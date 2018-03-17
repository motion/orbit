// @flow
import Bridge from './helpers/Bridge'
import { store, react } from '@mcro/black/store'
import global from 'global'
import App from './App'

let Electron

@store
class ElectronStore {
  state = {
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {
      mouseOver: false,
      pinned: false,
      fullScreen: false,
      arrowTowards: null,
      position: null,
      size: null,
    },
    peekState: {
      mouseOver: false,
      windows: null,
    },
    showSettings: false,
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
      settings: true,
    },
  }

  // runs in every app independently
  @react
  isMouseInActiveArea = [
    () => !!(Electron.orbitState.mouseOver || Electron.peekState.mouseOver),
    async (over, { sleep }) => {
      await sleep(over ? 0 : 100)
      return over
    },
    true,
  ]

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    const ElectronReactions = require('./ElectronReactions').default
    this.reactions = new ElectronReactions()
  }

  get orbitState() {
    return this.state.orbitState
  }

  get peekState() {
    return this.state.peekState
  }

  get currentPeek() {
    return (this.peekState.windows || [])[0]
  }

  get recentlyToggled() {
    if (Date.now() - Electron.state.shouldHide < 100) return true
    if (Date.now() - Electron.state.shouldShow < 100) return true
    return false
  }

  onShortcut = shortcut => {
    if (shortcut === 'Option+Space') {
      if (Electron.orbitState.fullScreen) {
        Electron.toggleFullScreen()
        return
      }
      if (App.state.orbitHidden) {
        Electron.toggleVisible()
        Electron.setPinned(true)
        return
      }
      if (Electron.orbitState.pinned) {
        Electron.togglePinned()
        Electron.toggleVisible()
        return
      } else {
        // !pinned
        Electron.togglePinned()
      }
    }
    if (shortcut === 'Option+Shift+Space') {
      Electron.toggleFullScreen()
    }
  }

  toggleVisible = () => {
    if (App.state.orbitHidden) {
      this.setState({ shouldShow: Date.now() })
    } else {
      this.setState({ shouldHide: Date.now() })
    }
  }

  togglePinned = () => {
    this.setPinned(!Electron.orbitState.pinned)
  }

  setPinned = pinned => {
    Electron.setOrbitState({ pinned })
  }

  toggleFullScreen = () => {
    this.setFullScreen(!Electron.orbitState.fullScreen)
  }

  setFullScreen = fullScreen => {
    Electron.setOrbitState({ fullScreen })
  }

  setOrbitState = orbitState => {
    this.setState({ orbitState })
  }

  setPeekState = peekState => {
    this.setState({ peekState })
  }
}

Electron = new ElectronStore()
Bridge.stores.ElectronStore = Electron
global.Electron = Electron

export default Electron
