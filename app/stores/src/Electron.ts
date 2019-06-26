import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { decorate, deep } from '@o/use-store'

export let Electron = null as ElectronStore

export type AppWindow = {
  appId: number
  type: string
  isEditing?: boolean
  isTorn?: boolean
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
    appWindows: {
      // starts with orbit main window
      [0]: {
        appId: 0,
        type: 'main',
      },
    } as { [id: number]: AppWindow },
    showDevTools: {
      app: false,
      0: false,
      1: false,
      2: false,
    },
  })

  get curMainWindow() {
    const lastIndex = Object.keys(this.state.appWindows).length - 1
    return this.state.appWindows[lastIndex]
  }

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores['Electron'] = Electron
