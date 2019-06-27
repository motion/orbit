import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { decorate, deep } from '@o/use-store'
import { getAppId } from './getAppId'

export let Electron = null as ElectronStore

export type AppWindow = {
  appId: number
  appRole: 'main' | 'editing' | 'torn'
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
        appRole: 'main',
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

  get appId() {
    return getAppId()
  }

  // to be used in electron processes
  // todo we could make this work across all proceses, for now its duplicated in App/Electron
  get appConf() {
    return this.state.appWindows[this.appId]
  }

  get isMainWindow() {
    return this.appId === this.curMainWindow.appId
  }

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }
}

Electron = proxySetters(new ElectronStore())
Bridge.stores['Electron'] = Electron
