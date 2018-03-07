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
    showSettings: null,
    showDevTools: {},
    lastMove: null,
    settingsPosition: [],
    screenSize: [],
    orbit: {
      focused: false,
    },
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
  }

  start(options) {
    return Bridge.start(this, this.state, options)
  }

  get peekWindow() {
    return (
      (this.state.peekState &&
        this.state.peekState.windows &&
        this.state.peekState.windows[0]) ||
      null
    )
  }
}

const electron = new Electron()
Bridge.stores.Electron = electron
global.Electron = electron

export default electron
