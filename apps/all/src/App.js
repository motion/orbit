// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'
import Desktop from './Desktop'
import Electron from './Electron'

const log = debug('App')
let App

@store
class AppStore {
  state = {
    query: null,
    selectedItem: null,
    openResult: null,
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: 'Orbit',
    closePeek: null,
    orbitHidden: true,
    knowledge: null,
    peekTarget: null,
    shouldTogglePinned: null,
  }

  uid = 10

  get isShowingOrbit() {
    return (
      Electron.orbitState.fullScreen ||
      Electron.orbitState.pinned ||
      !this.state.orbitHidden
    )
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get showHeader() {
    return (
      Electron.orbitState.fullScreen ||
      Electron.orbitState.focused ||
      Electron.orbitState.pinned
    )
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.bridge = Bridge
  }

  runReactions() {
    this.showOrbitOnHoverWord()
    this.hideOrbitOnMouseOut()
    this.showOrbitOnPin()
    this.hideOrbitOnEsc()
    this.clearPeekTarget()
  }

  clearPeekTarget = () => {
    this.react(
      () => Electron.orbitState.focused,
      focused => {
        if (!focused) {
          App.setState({ peekTarget: null })
        }
      },
    )
    this.react(
      () => Electron.orbitState.fullScreen,
      fullScreen => {
        if (!fullScreen) {
          App.setState({ peekTarget: null })
        }
      },
    )
  }

  hideOrbitOnEsc = () => {
    // react to close orbit
    this.react(
      () => Desktop.state.keyboard.esc,
      () => {
        if (!App.state.orbitHidden) {
          log(`hideOrbit on esc`)
          App.setState({ orbitHidden: true })
        }
      },
    )
  }

  showOrbitOnPin = () => {
    this.react(
      () => Electron.orbitState.pinned,
      pinned => App.setState({ orbitHidden: !pinned }),
    )
  }

  hideOrbitOnMouseOut = () => {
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
  }

  showOrbitOnHoverWord = () => {
    // react to hovered words
    let hoverShow
    this.react(
      () => App.hoveredWordName,
      word => {
        if (Desktop.isHoldingOption) {
          return
        }
        clearTimeout(hoverShow)
        const orbitHidden = !word
        hoverShow = setTimeout(() => {
          console.log('sethidden based on word', orbitHidden)
          App.setState({ orbitHidden })
        }, orbitHidden ? 50 : 500)
      },
    )
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
