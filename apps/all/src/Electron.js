// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class Electron {
  get setState() {
    return Bridge._setState
  }

  state = {
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {},
    peekState: {
      focused: false,
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
    return Bridge.start(this, this.state, options)
  }

  get orbitState() {
    return this.state.orbitState
  }

  get peekState() {
    return this.state.peekState
  }
}

const electron = new Electron()
Bridge.stores.Electron = electron
global.Electron = electron

export default electron
