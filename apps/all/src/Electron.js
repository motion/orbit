// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
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
    lastAction: null,
    orbitState: {
      show: false,
      focused: false,
      pinned: false,
      arrowTowards: null,
      position: null,
      size: null,
    },
    peekState: {
      arrowTowards: null,
      position: null,
      size: null,
    },
    showSettings: false,
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
      settings: true,
    },
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState

    // clear pinned on explicit hide
    this.react(
      () => App.state.orbitHidden,
      hidden => {
        if (hidden) {
          Electron.setOrbitState({ pinned: false })
        }
      },
      true,
    )
  }

  get orbitState() {
    return this.state.orbitState
  }

  get peekState() {
    return this.state.peekState
  }

  get currentPeek() {
    return this.peekState.windows[0]
  }

  setOrbitState = nextState => {
    this.setState({ orbitState: { ...this.state.orbitState, ...nextState } })
  }

  setPeekState = nextState => {
    this.setState({ peekState: { ...this.state.peekState, ...nextState } })
  }
}

Electron = new ElectronStore()
Bridge.stores.ElectronStore = Electron
global.Electron = Electron

export default Electron
