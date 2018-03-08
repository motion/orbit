// @flow
import Electron from './Electron'
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

const log = debug('App')
let App

@store
class AppStore {
  state = {
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    preventElectronHide: true,
    contextMessage: 'Orbit',
    closePeek: null,
    orbitHidden: true,
    knowledge: null,
    peekTarget: null,
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState

    this.react(
      () => [Electron.state.lastAction === 'HOLD', Electron.orbitState.focused],
      ([wasHolding, isFocused]) => {
        if (wasHolding && !isFocused && !App.state.orbitHidden) {
          log(
            `hiding because your mouse moved outside the window after option release`,
          )
          this.setState({ orbitHidden: true })
        }
      },
    )
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return Electron.orbitState.focused || Electron.state.lastAction === 'TOGGLE'
  }

  togglePeek = () => {
    this.setState({ disablePeek: !this.state.disablePeek })
  }

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  openSettings = () => {
    this.setState({ openSettings: Date.now() })
  }
}

App = new AppStore()
global.App = App
Bridge.stores.AppStore = App

export default App
