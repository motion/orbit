// @flow
import Electron from './Electron'
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class App {
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
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return Electron.orbitState.focused
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

const app = new App()
global.App = app
Bridge.stores.App = app

export default app
