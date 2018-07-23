import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black/store'

export let Electron = null as ElectronStore

@store
class ElectronStore {
  hoverState: ElectronStore['state']['hoverState']
  setHoverState: Function

  messages = {
    CLEAR: 'CLEAR',
    DEFOCUS: 'DEFOCUS',
    FOCUS: 'FOCUS',
  }

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Electron'

  onClear = null
  lastAction = null

  state = deep({
    screenSize: [0, 0],
    settingsPosition: [], // todo: settingsState.position
    hoverState: {
      orbitHovered: false,
      peekHovered: false,
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
