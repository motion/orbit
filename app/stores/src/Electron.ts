import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'

export let Electron = null as ElectronStore

// @ts-ignore
@store
class ElectronStore {
  hoverState: ElectronStore['state']['hoverState']
  setHoverState: Function

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
    realTime: false,
    focusedAppId: 'app',
    screenSize: [0, 0],
    settingsPosition: [], // todo: settingsState.position
    updateState: {
      downloading: false,
      percent: 0,
    },
    hoverState: {
      orbitHovered: false,
      peekHovered: {
        0: false,
      },
    },
    showDevTools: {
      app: false,
      0: false,
      1: false,
      2: false,
    },
  })

  start = async options => {
    await Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
