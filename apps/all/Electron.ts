import Bridge from './helpers/Bridge'
import { setGlobal, proxySetters } from './helpers'
import { store, react } from '@mcro/black/store'
import global from 'global'
import { App } from './App'
import ElectronReactions from './ElectronReactions'
import debug from '@mcro/debug'
import { globalState } from 'mobx/lib/core/globalstate'

const log = debug('ElectronStore')

export let Electron

@store
class ElectronStore {
  messages = {
    CLEAR: 'CLEAR',
    TOGGLE_PINNED: 'TOGGLE_PINNED',
  }

  setState: typeof Bridge.setState
  sendMessage: typeof Bridge.sendMessage
  onMessage: typeof Bridge.onMessage
  reactions: ElectronReactions
  source = 'Electron'
  onClear = null

  lastAction = null

  state = {
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
  @react({ fireImmediately: true, log: false })
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
    this.sendMessage = Bridge.sendMessage
    this.onMessage = Bridge.onMessage
    const ElectronReactions = eval(`require('./ElectronReactions')`).default
    this.reactions = new ElectronReactions()
  }

  get orbitArrowTowards() {
    return Electron.orbitState.orbitOnLeft ? 'right' : 'left'
  }

  get orbitOnLeft() {
    if (Electron.orbitState.orbitDocked) {
      return true
    }
    return Electron.orbitState.orbitOnLeft
  }

  get peekOnLeft() {
    return this.currentPeek.peekOnLeft
  }

  get currentPeek() {
    return (Electron.peekState.windows || [])[0] || {}
  }

  updatePeek = (peek, cb) => {
    const windows = Electron.peekState.windows.slice(0)
    const nextPeek = windows.find(x => x.key === peek.key)
    cb(nextPeek)
    Electron.setPeekState({ windows })
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
setGlobal('Electron', Electron)
