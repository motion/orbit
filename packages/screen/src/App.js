// @flow
import Screen from './Screen'
import { store } from '@mcro/black/store'

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

  actions = {
    togglePeek: () => {
      this.setState({ disablePeek: !this.state.disablePeek })
    },
    openSettings: () => {
      this.setState({ openSettings: Date.now() })
    },
  }
}

export default new App()
