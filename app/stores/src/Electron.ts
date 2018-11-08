import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'

export let Electron = null as ElectronStore

@store
class ElectronStore {
  messages = {
    CLEAR: 'CLEAR',
    FOCUS: 'FOCUS',
    COPY: 'COPY',
    RESTART: 'RESTART',
  }

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Electron'

  lastAction = null

  state = deep({
    pinKey: { name: '', at: Date.now() },
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

  start = async (options?) => {
    await Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
