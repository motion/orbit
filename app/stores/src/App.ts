import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { User } from '@o/models'
import { decorate, deep } from '@o/use-store'

import { Desktop } from './Desktop'
import { AppWindow, Electron } from './Electron'
import { getWindowId } from './getWindowId'

export let App = null as AppStore

// run before window changes
const windowId = getWindowId()

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

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge = Bridge
  source = 'App'

  state = deep({
    vibrancy: '',
    // for use syncing them to electron
    userSettings: {} as User['settings'],
    orbitState: {
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
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: '',
    showSpaceSwitcher: 0,
  })

  get windowId() {
    return windowId
  }

  get appConf(): AppWindow {
    return (
      Electron.state.appWindows[this.windowId] || {
        windowId: this.windowId,
        appRole: 'main',
        identifier: '',
      }
    )
  }

  get bundleUrl() {
    return `/appServer/${this.windowId}/bundle.js`
  }

  get appRole() {
    return this.appConf.appRole
  }

  get isMainApp() {
    return this.appRole === 'main'
  }

  get isEditing() {
    return this.appRole === 'editing'
  }

  get isDark() {
    const preference = App.state.userSettings.theme
    const osTheme = Desktop.state.operatingSystem.theme
    return preference === 'dark' || (preference === 'automatic' && osTheme === 'dark')
  }

  get vibrancy() {
    // allow override
    if (App.state.vibrancy) {
      return App.state.vibrancy
    }
    const { vibrancy } = App.state.userSettings
    if (vibrancy === 'none') {
      return 'none'
    }
    if (vibrancy === 'more') {
      return App.isDark ? 'dark' : 'light'
    }
    return App.isDark ? 'selection' : 'medium-light'
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
