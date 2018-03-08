// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class Electron {
  state = {
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {
      show: false,
      focused: false,
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

const electron = new Electron()
Bridge.stores.Electron = electron
global.Electron = electron

export default electron
