// @flow
import Bridge from './helpers/Bridge'
import { store, react } from '@mcro/black/store'
import { debounce } from 'lodash'
import global from 'global'
import App from './App'
import Desktop from './Desktop'

let Electron
const log = debug('Electron')
const sleep = ms => new Promise(res => setTimeout(res, ms))

@store
class ElectronStore {
  state = {
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {
      show: false,
      mouseOver: false,
      pinned: false,
      fullScreen: false,
      arrowTowards: null,
      position: null,
      size: null,
    },
    peekState: {
      mouseOver: false,
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

  // runs in every app independently
  @react
  isMouseInActiveArea = [
    () =>
      Electron.orbitState.mouseOver || Electron.peekState.mouseOver || false,
    async over => {
      // debounce mouseout by 100ms
      await sleep(over ? 0 : 100)
      return over
    },
    true,
  ]

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
    this.react(() => Desktop.state.shouldTogglePin, Electron.togglePinned)

    // TODO ElectronReactions
    // track mouseovers
    // if mouse within bounds + not hidden, focus orbit
    const isMouseOver = (app, mousePosition) => {
      if (!app || !mousePosition) return false
      const { x, y } = mousePosition
      const { position, size } = app
      if (!position || !size) return false
      const withinX = x > position[0] && x < position[0] + size[0]
      const withinY = y > position[1] && y < position[1] + size[1]
      return withinX && withinY
    }
    this.react(
      () => [Desktop.state.mousePosition, App.state.orbitHidden],
      ([mousePosition, isHidden]) => {
        if (Electron.orbitState.pinned) {
          return
        }
        if (isHidden) {
          if (Electron.orbitState.mouseOver) {
            Electron.setOrbitState({ mouseOver: false })
            Electron.setPeekState({ mouseOver: false })
          }
          return
        }
        if (Electron.orbitState.position) {
          const mouseOver = isMouseOver(Electron.orbitState, mousePosition)
          if (mouseOver !== Electron.orbitState.mouseOver) {
            Electron.setOrbitState({ mouseOver })
          }
        }
        if (App.isShowingPeek) {
          const mouseOver = isMouseOver(Electron.currentPeek, mousePosition)
          if (mouseOver !== Electron.peekState.mouseOver) {
            Electron.setPeekState({ mouseOver })
          }
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
          if (!Electron.orbitState.pinned && Electron.isMouseInActiveArea) {
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
          }, 4000)
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
    Electron.setOrbitState({ pinned })
  }

  toggleFullScreen = () => {
    this.setFullScreen(!Electron.orbitState.fullScreen)
  }

  setFullScreen = fullScreen => {
    Electron.setOrbitState({ fullScreen })
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
