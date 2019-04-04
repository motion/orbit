import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { User } from '@o/models'
import { decorate, deep } from '@o/use-store'
import { Desktop } from './Desktop'

export let App = null as AppStore

export type AppStartupConfig = {
  appId: number
  appInDev?: null | AppInDev
}

export type AppInDev = {
  bundleURL: string
  path: string
}

function getAppStartupConfig(): AppStartupConfig {
  let initial = {
    appId: 0,
    appInDev: null,
  }
  if (process.env[ORBIT_APP_STARTUP_CONFIG] != null) {
    try {
      return JSON.parse(process.env[ORBIT_APP_STARTUP_CONFIG])
    } catch (_err) {
      return initial
    }
  } else {
    return initial
  }
}

export let ORBIT_APP_STARTUP_CONFIG = 'ORBIT_APP_STARTUP_CONFIG'

export let appStartupConfig: AppStartupConfig = getAppStartupConfig()
export let isEditing: boolean = appStartupConfig.appInDev != null

export type AppState = {
  id: number
  appProps: any // TODO
  viewType?: 'index' | 'main' | 'setup'
  torn: boolean
  target?: { top: number; left: number; width: number; height: number }
  peekOnLeft: boolean
  position: [number, number]
  size: [number, number]
}

export const defaultPeekState: AppState = {
  id: 0,
  torn: false,
  target: null,
  appProps: null,
  peekOnLeft: false,
  position: [0, 0],
  size: [0, 0],
}

export type MenuState = {
  id: number
  open: boolean
  position: [number, number]
  size: [number, number]
}

const defaultMenuState = (index: number): MenuState => ({
  id: index,
  open: false,
  position: [0, 0],
  size: [0, 0],
})

export type AppStateEntry = {
  id: number
  type: string
  appId: number
}

@decorate
class AppStore {
  // TODO proxySetters should auto-type this
  // shortcuts
  orbitState: AppStore['state']['orbitState']
  authState: AppStore['state']['authState']
  peeksState: AppStore['state']['peeksState']
  setOrbitState: Function
  setAuthState: Function

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge = Bridge
  source = 'App'

  state = deep({
    // for use syncing them to electron
    userSettings: {} as User['settings'],
    allApps: [
      {
        id: 0,
        appId: 0,
        type: 'root',
      },
    ] as AppStateEntry[],
    orbitState: {
      docked: false,
      orbitOnLeft: false,
      position: [0, 0],
      size: [0, 0],
      shortcutInputFocused: false,
    },
    trayState: {
      menuState: {
        0: defaultMenuState(0),
        1: defaultMenuState(1),
        2: defaultMenuState(2),
        3: defaultMenuState(3),
      },
    },
    peeksState: [defaultPeekState],
    authState: {
      openId: null,
      closeId: null,
    },
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: '',
    showSpaceSwitcher: 0,
  })

  get isDark() {
    const preference = App.state.userSettings.theme
    const osTheme = Desktop.state.operatingSystem.theme
    return preference === 'dark' || (preference === 'automatic' && osTheme === 'dark')
  }

  get vibrancy() {
    const { vibrancy } = App.state.userSettings
    if (vibrancy === 'none') {
      return 'none'
    }
    if (vibrancy === 'more') {
      return App.isDark ? 'ultra-dark' : 'light'
    }
    return App.isDark ? 'ultra-dark' : 'light'
  }

  get peekState() {
    return this.state.peeksState[0]
  }

  get isShowingPeek() {
    return this.peekState && !!this.peekState.appProps
  }

  get isShowingMenu() {
    return typeof this.openMenu === 'number'
  }

  getAppState(id: number): AppState {
    return {
      ...this.state.peeksState.find(x => x.id === id),
    }
  }

  get openMenu(): MenuState {
    const { menuState } = App.state.trayState
    const menusState = Object.keys(menuState).map(x => menuState[x])
    return menusState.find(x => x.open) || null
  }

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }
}

App = proxySetters(new AppStore())
Bridge.stores['App'] = App
