import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { decorate, deep } from '@o/use-store'

export let Electron = null as ElectronStore

export type AppWindow = {
  appId: number
  type: string
  isEditing?: boolean
  path?: string
  bundleURL?: string
}

@decorate
class ElectronStore {
  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Electron'

  lastAction = null

  // This indicates if this instance of Electron is "main"
  isTorn = false

  state = deep({
    showOrbitMain: false,
    focusedAppId: 'app',
    screenSize: [0, 0],
    updateState: {
      downloading: false,
      percent: 0,
    },
    appWindows: {} as { [id: string]: AppWindow },
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
