// @flow
import Bridge from './helpers/Bridge'
import { store, react } from '@mcro/black/store'
import global from 'global'
import ElectronReactions from './ElectronReactions'

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
      console.time('out')
      await sleep(over ? 0 : 100)
      console.timeEnd('out')
      return over
    },
    true,
  ]

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.reactions = new ElectronReactions()
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

  setOrbitState = orbitState => {
    this.setState({ orbitState })
  }

  setPeekState = peekState => {
    this.setState({ peekState })
  }
}

Electron = new ElectronStore()
Bridge.stores.ElectronStore = Electron
global.Electron = Electron

export default Electron
