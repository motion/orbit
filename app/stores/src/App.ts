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

const conf = eval(`process.env['ORBIT_APP_STARTUP_CONFIG']`)

function getAppStartupConfig(): AppStartupConfig {
  let initial = {
    appId: null,
    appInDev: null,
  }
  // otherwise webpack filters it away
  if (conf != null) {
    try {
      return JSON.parse(conf)
    } catch (_err) {
      return initial
    }
  } else {
    return initial
  }
}

export let ORBIT_APP_STARTUP_CONFIG = 'ORBIT_APP_STARTUP_CONFIG'

export let appStartupConfig: AppStartupConfig = getAppStartupConfig()
console.log('appStartupConfig', appStartupConfig, conf)

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

@decorate
class AppStore {
  // TODO proxySetters should auto-type this
  // shortcuts
  orbitState: AppStore['state']['orbitState']
  authState: AppStore['state']['authState']
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

  get isEditing() {
    return appStartupConfig.appInDev != null
  }

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

  get isShowingMenu() {
    return typeof this.openMenu === 'number'
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
