// @flow
import Bridge from './helpers/Bridge'
import proxySetters from './helpers/proxySetters'
import { store, react } from '@mcro/black/store'
import global from 'global'
import App from './App'

let Electron

@store
class ElectronStore {
  state = {
    shouldHide: 1,
    shouldShow: 0,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {
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
    () => !!(Electron.orbitState.mouseOver || Electron.peekState.mouseOver),
    async (over, { sleep }) => {
      await sleep(over ? 0 : 100)
      return over
    },
    true,
  ]

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    const ElectronReactions = eval(`require('./ElectronReactions')`).default
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

  get recentlyToggled() {
    if (
      Date.now() - Electron.state.shouldHide <= App.animationDuration ||
      Date.now() - Electron.state.shouldShow <= App.animationDuration
    ) {
      return true
    }
    return false
  }

  get onLeft() {
    return this.orbitState.arrowTowards === 'right'
  }

  get peekOnLeft() {
    return this.peekState.arrowTowards === 'right'
  }

  onShortcut = shortcut => {
    if (shortcut === 'Option+Space') {
      if (Electron.orbitState.fullScreen) {
        Electron.toggleFullScreen()
        return
      }
      if (App.state.orbitHidden) {
        Electron.toggleVisible()
        Electron.setPinned(true)
        return
      }
      if (Electron.orbitState.pinned) {
        Electron.togglePinned()
        Electron.toggleVisible()
        return
      } else {
        // !pinned
        Electron.togglePinned()
      }
    }
    if (shortcut === 'Option+Shift+Space') {
      Electron.toggleFullScreen()
    }
  }

  updatePeek = (peek, cb) => {
    const windows = Electron.peekState.windows.slice(0)
    const nextPeek = windows.find(x => x.key === peek.key)
    cb(nextPeek)
    Electron.setPeekState({ windows })
  }

  shouldShow = () => Electron.setShouldShow(Date.now())
  shouldHide = () => Electron.setShouldHide(Date.now())
  shouldPause = () => Electron.setShouldPause(Date.now())

  toggleVisible = () => {
    if (App.state.orbitHidden) {
      this.shouldShow()
    } else {
      this.shouldHide()
    }
  }

  togglePinned = () => {
    this.setPinned(!Electron.orbitState.pinned)
  }

  setPinned = pinned => {
    Electron.setOrbitState({ pinned })
  }

  toggleFullScreen = () => {
    const fullScreen = !Electron.orbitState.fullScreen
    if (fullScreen) {
      const { round } = Math
      const [screenW, screenH] = this.reactions.screenSize()
      const [appW, appH] = [screenW / 1.5, screenH / 1.3]
      const [orbitW, orbitH] = [appW * 1 / 3, appH]
      const [orbitX, orbitY] = [(screenW - appW) / 2, (screenH - appH) / 2]
      const [peekW, peekH] = [appW * 2 / 3, appH]
      const [peekX, peekY] = [orbitX + orbitW, orbitY]
      Electron.setOrbitState({
        position: [orbitX, orbitY].map(round),
        size: [orbitW, orbitH].map(round),
        arrowTowards: 'right',
        fullScreen: true,
        hasPositionedFullScreen: false,
      })
      const [peek, ...rest] = Electron.peekState.windows
      peek.position = [peekX, peekY].map(round)
      peek.size = [peekW, peekH].map(round)
      peek.arrowTowards = 'left'
      Electron.setPeekState({ windows: [peek, ...rest] })
    } else {
      Electron.setOrbitState({ fullScreen: false })
    }
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores.ElectronStore = Electron
global.Electron = Electron

export default Electron
