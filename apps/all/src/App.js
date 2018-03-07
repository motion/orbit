// @flow
import { Electron } from './Electron'
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class App {
  state = {
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    peekHidden: null,
    preventElectronHide: null,
    contextMessage: null,
    closePeek: null,
    disablePeek: null,
  }

  get setState() {
    return Bridge._setState
  }

  start(...args) {
    return Bridge.start(this, ...args)
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return Electron.state.peekFocused
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

export default app
