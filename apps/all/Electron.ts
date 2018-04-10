import Bridge from './helpers/Bridge'
import { setGlobal, proxySetters } from './helpers'
import { store, react } from '@mcro/black/store'
import global from 'global'
import { App } from './App'
import ElectronReactions from './ElectronReactions'
import debug from '@mcro/debug'

const log = debug('ElectronStore')

export let Electron

@store
class ElectronStore {
  setState: typeof Bridge.setState
  sendMessageTo: typeof Bridge.sendMessageTo
  onMessage: typeof Bridge.onMessage
  reactions: ElectronReactions
  source = 'Electron'

  state = {
    willReposition: Date.now(),
    shouldHide: 1,
    shouldShow: 0,
    shouldPause: null,
    settingsPosition: [], // todo: settingsState.position
    orbitState: {
      mouseOver: false,
      pinned: false,
      fullScreen: false,
      orbitOnLeft: false,
      position: [],
      size: [],
    },
    peekState: {
      mouseOver: false,
      windows: null,
    },
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
    },
  }

  // runs in every app independently
  @react({ fireImmediately: true })
  isMouseInActiveArea = [
    () => !!(Electron.orbitState.mouseOver || Electron.peekState.mouseOver),
    async (over, { sleep, setValue }) => {
      await sleep(over ? 0 : 100)
      setValue(over)
    },
  ]

  start = options => {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.sendMessageTo = Bridge.sendMessageTo
    this.onMessage = Bridge.onMessage
    const ElectronReactions = eval(`require('./ElectronReactions')`).default
    this.reactions = new ElectronReactions()
  }

  get orbitArrowTowards() {
    return Electron.orbitState.orbitOnLeft ? 'right' : 'left'
  }

  get orbitOnLeft() {
    return Electron.orbitState.orbitOnLeft
  }

  get peekOnLeft() {
    return this.currentPeek.peekOnLeft
  }

  get currentPeek() {
    return (Electron.peekState.windows || [])[0] || {}
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
    log(`toggle fullscreen`)
    if (!fullScreen) {
      Electron.setOrbitState({ fullScreen })
      return
    }
    Electron.setState({ willReposition: Date.now() })
    setTimeout(() => {
      // orbit props
      const { round } = Math
      const [screenW, screenH] = this.reactions.screenSize()
      const [appW, appH] = [screenW / 1.5, screenH / 1.3]
      const [orbitW, orbitH] = [appW * 1 / 3, appH]
      const [orbitX, orbitY] = [(screenW - appW) / 2, (screenH - appH) / 2]
      // peek props
      const [peekW, peekH] = [appW * 2 / 3, appH]
      const [peekX, peekY] = [orbitX + orbitW, orbitY]
      const [peek, ...rest] = Electron.peekState.windows
      peek.position = [peekX, peekY].map(round)
      peek.size = [peekW, peekH].map(round)
      peek.peekOnLeft = false
      // update
      Electron.setState({
        orbitState: {
          position: [orbitX, orbitY].map(round),
          size: [orbitW, orbitH].map(round),
          orbitOnLeft: true,
          fullScreen: true,
        },
        peekState: {
          windows: [peek, ...rest],
        },
      })
    }, 100)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
setGlobal('Electron', Electron)
