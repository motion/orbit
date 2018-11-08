import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'
import { AppConfig } from './AppConfig'

export let App = null as AppStore

export type AppState = {
  id: number
  torn: boolean
  target?: { top: number; left: number; width: number; height: number }
  appConfig: AppConfig
  peekOnLeft: boolean
  viewConfig?: any
  position: [number, number]
  size: [number, number]
}

export const defaultPeekState: AppState = {
  id: 0,
  torn: false,
  target: null,
  appConfig: null,
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

@store
class AppStore {
  // TODO proxySetters should auto-type this
  // shortcuts
  orbitState: AppStore['state']['orbitState']
  authState: AppStore['state']['authState']
  appsState: AppStore['state']['appsState']
  setOrbitState: Function
  setAppsState: Function
  setAuthState: Function

  messages = {
    SHOW_APPS: 'SHOW_APPS',
    TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    CLEAR_SELECTED: 'CLEAR_SELECTED',
    FORWARD_STATUS: 'FORWARD_STATUS',
    NOTIFICATION: 'NOTIFICATION',
    CLOSE_APP: 'CLOSE_APP',
    PROXY_FN_RESPONSE: 'PROXY_FN_RESPONSE',
    TRAY_EVENT: 'TRAY_EVENT',
  }

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge = Bridge
  source = 'App'

  state = deep({
    query: '',
    screenSize: [0, 0],
    darkTheme: true,
    orbitState: {
      pinned: false,
      docked: false,
      orbitOnLeft: false,
      position: [0, 0],
      size: [0, 0],
      inputFocused: false,
      shortcutInputFocused: false,
    },
    trayState: {
      trayEvent: '',
      trayEventAt: 0,
      menuState: {
        0: defaultMenuState(0),
        1: defaultMenuState(1),
        2: defaultMenuState(2),
        3: defaultMenuState(3),
      },
    },
    appsState: [defaultPeekState],
    authState: {
      openId: null,
      closeId: null,
    },
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: '',
    acceptsForwarding: false,
    lastTear: 0,
    showSpaceSwitcher: 0,
  })

  get peekState() {
    return this.state.appsState[0]
  }

  get showingPeek() {
    return !!this.peekState.appConfig
  }

  getAppState(id: number): AppState {
    return this.state.appsState.find(x => x.id === id)
  }

  get openMenu(): MenuState {
    const { menuState } = App.state.trayState
    const menusState = Object.keys(menuState).map(x => menuState[x])
    return menusState.find(x => x.open)
  }

  start = async (options?) => {
    await Bridge.start(this, this.state, options)
  }
}

App = proxySetters(new AppStore())
Bridge.stores[App.source] = App
