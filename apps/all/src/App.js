// @flow
import Electron from './Electron'
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'
import Desktop from './Desktop'

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
    shouldTogglePinned: null,
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState

    console.log('Electron.orbitState', Electron.orbitState)
    this.react(
      () => [
        !App.state.orbitHidden,
        Electron.orbitState.pinned,
        Electron.orbitState.focused,
      ],
      ([isShown, isPinned, isFocused]) => {
        if (Desktop.isHoldingOption) {
          return
        }
        if (isShown && !isPinned && !isFocused) {
          log(
            `hiding because your mouse moved outside the window after option release`,
          )
          App.setState({ orbitHidden: true })
        }
      },
    )

    this.react(
      () => Electron.orbitState.pinned,
      pinned => App.setState({ orbitHidden: !pinned }),
    )
  }

  get isShowingOrbit() {
    return !this.state.orbitHidden || Electron.state.orbitState.pinned
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return Electron.orbitState.focused || Electron.orbitState.pinned
  }

  togglePinned = () => {
    this.setState({ shouldTogglePinned: Date.now() })
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
