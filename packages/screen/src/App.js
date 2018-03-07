// @flow
import Screen from './Screen'
import { store } from '@mcro/black/store'
import global from 'global'

@store
class App {
  get state() {
    return Screen.appState
  }

  get setState() {
    return Screen._setState
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return Screen.electronState.peekFocused
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
