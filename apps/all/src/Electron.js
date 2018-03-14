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
    orbitState: {
      show: false,
      focused: false,
      pinned: false,
      arrowTowards: null,
      position: null,
      size: null,
    },
    peekState: {
      windows: null,
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

    // toggle pinned from app
    this.react(() => App.state.shouldTogglePinned, Electron.togglePinned)

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

    // option double tap to pin
    this.react(
      () => Desktop.state.shouldPin,
      shouldPin => {
        if (shouldPin) {
          Electron.setOrbitState({ pinned: true })
        }
      },
    )

    // option tap to clear if open
    // let lastDown = 0
    // this.react(
    //   () => Desktop.isHoldingOption,
    //   holding => {
    //     const justTapped = !holding && Date.now() - lastDown < 100
    //     if (justTapped) {
    //       Electron.setState({ shouldHide: Date.now() })
    //     }
    //     if (holding) {
    //       lastDown = Date.now()
    //     }
    //   },
    // )

    // orbit show/hide based on option hold
    let showAfterDelay
    let stickAfterDelay
    this.react(
      () => Desktop.isHoldingOption,
      debounce(isHoldingOption => {
        clearTimeout(showAfterDelay)
        clearTimeout(stickAfterDelay)
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
          Electron.setState({ shouldHide: Date.now() })
          return
        }
        if (App.state.orbitHidden) {
          // SHOW
          showAfterDelay = setTimeout(() => {
            Electron.setState({ shouldShow: Date.now() })
          }, 150)
          stickAfterDelay = setTimeout(() => {
            log(`held open for 3 seconds, sticking...`)
            Electron.setPinned(true)
          }, 2500)
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
    return (this.peekState.windows || [])[0]
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
