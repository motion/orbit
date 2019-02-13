import { deep, store } from '@mcro/black'
import { Bridge, BridgeOptions, proxySetters } from '@mcro/mobx-bridge'

export let Electron = null as ElectronStore

export type PinKeyType =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'left'
  | 'right'
  | 'down'

@store
class ElectronStore {
  messages = {
    CLEAR: 'CLEAR',
    FOCUS: 'FOCUS',
    COPY: 'COPY',
    RESTART: 'RESTART',
    TEAR_APP: 'TEAR_APP',
    CLOSE_APP: 'CLOSE_APP',
  }

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Electron'

  lastAction = null
  // TODO make this way more legit, for now this works...
  isTorn = false

  state = deep({
    pinKey: { name: '' as PinKeyType, at: Date.now() },
    realTime: false,
    focusedAppId: 'app',
    screenSize: [0, 0],
    settingsPosition: [], // todo: settingsState.position
    updateState: {
      downloading: false,
      percent: 0,
    },
    showDevTools: {
      app: false,
      0: false,
      1: false,
      2: false,
    },
  })

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }

  setIsTorn() {
    this.isTorn = true
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores['Electron'] = Electron
