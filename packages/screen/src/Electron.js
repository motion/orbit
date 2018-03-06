// @flow
import Screen from './Screen'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class Electron {
  get state() {
    return Screen.electronState
  }

  get setState() {
    return Screen._setState
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
