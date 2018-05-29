import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { setGlobal } from './helpers'
import { store, deep } from '@mcro/black/store'
import { ElectronReactions } from './ElectronReactions'
// import debug from '@mcro/debug'

// const log = debug('ElectronStore')

export let Electron

@store
class ElectronStore {
  messages = {
    CLEAR: 'CLEAR',
    DEFOCUS: 'DEFOCUS',
    FOCUS: 'FOCUS',
  }

  setState: typeof Bridge.setState
  sendMessage: typeof Bridge.sendMessage
  onMessage: typeof Bridge.onMessage
  reactions: ElectronReactions
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
    this.setState = Bridge.setState
    this.sendMessage = Bridge.sendMessage
    this.onMessage = Bridge.onMessage
    const { ElectronReactions } = eval(`require('./ElectronReactions')`)
    this.reactions = new ElectronReactions()
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores[Electron.source] = Electron
setGlobal('Electron', Electron)
