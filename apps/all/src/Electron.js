// @flow
import Bridge from './Bridge'
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
    peekFocused: false,
    peekState: {},
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
  }

  start(...args) {
    Bridge.start(this, ...args)
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
global.Electron = electron

export default electron
