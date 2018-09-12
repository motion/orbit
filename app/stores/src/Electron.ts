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
    DEFOCUS: 'DEFOCUS',
    FOCUS: 'FOCUS',
    COPY: 'COPY',
    RESTART: 'RESTART',
    APP_STATE: 'APP_STATE',
  }

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Electron'

  lastAction = null

  state = deep({
    focusedAppId: 'app',
    screenSize: [0, 0],
    settingsPosition: [], // todo: settingsState.position
    hoverState: {
      orbitHovered: false,
      peekHovered: {
        0: false,
      },
    },
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
    },
  })

  start = async options => {
    await Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
