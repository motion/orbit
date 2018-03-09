// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import { debounce } from 'lodash'
import global from 'global'
import App from './App'
import Desktop from './Desktop'

let Electron
const log = debug('Electron')

@store
class ElectronStore {
  state = {
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    lastAction: null,
    orbitState: {
      show: false,
      focused: false,
      pinned: false,
      arrowTowards: null,
      position: null,
      size: null,
    },
    peekState: {
      arrowTowards: null,
      position: null,
      size: null,
    },
    showSettings: false,
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
      settings: true,
    },
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState

    // clear pinned on explicit hide
    this.react(
      () => App.state.orbitHidden,
      hidden => {
        if (hidden) {
          Electron.setOrbitState({ pinned: false })
        }
      },
      true,
    )

    // orbit show/hide based on option hold
    let optnEnter
    this.react(
      () => Desktop.isHoldingOption,
      debounce(isHoldingOption => {
        clearTimeout(optnEnter)
        if (Electron.orbitState.pinned) {
          log(`pinned, avoid`)
          return
        }
        if (!isHoldingOption) {
          // TODO
          if (!Electron.orbitState.pinned && Electron.orbitState.focused) {
            log('prevent hide while mouseover after release hold')
            return
          }
          Electron.setState({
            shouldHide: Date.now(),
            lastAction: null,
          })
          return
        }
        if (App.state.orbitHidden) {
          // SHOW
          optnEnter = setTimeout(() => {
            Electron.setState({ shouldShow: Date.now() })
          }, 150)
        }
      }, 16),
    )
  }

  get orbitState() {
    return this.state.orbitState
  }

  get peekState() {
    return this.state.peekState
  }

  get currentPeek() {
    return this.peekState.windows[0]
  }

  togglePinned = () => {
    this.setPinned(!Electron.orbitState.pinned)
  }

  setPinned = pinned => {
    Electron.setOrbitState({ pinned, focused: pinned })
  }

  setOrbitState = nextState => {
    this.setState({ orbitState: { ...this.state.orbitState, ...nextState } })
  }

  setPeekState = nextState => {
    this.setState({ peekState: { ...this.state.peekState, ...nextState } })
  }
}

Electron = new ElectronStore()
Bridge.stores.ElectronStore = Electron
global.Electron = Electron

export default Electron
