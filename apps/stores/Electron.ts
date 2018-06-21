import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { setGlobal } from './helpers'
import { store, deep } from '@mcro/black/store'

export let Electron

@store
class ElectronStore {
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
    settingsPosition: [], // todo: settingsState.position
    showDevTools: {
      orbit: false,
      peek: false,
      highlights: false,
    },
  })

  start = options => {
    Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
setGlobal('Electron', Electron)
