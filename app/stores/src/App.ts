import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'
import { AppConfig } from './AppConfig'

export let App = null as ViewStore

type AppState = {
  id: number
  torn: boolean
  target?: { top: number; left: number; width: number; height: number }
  appConfig: AppConfig
  peekOnLeft: boolean
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

const DEFAULT_MENU_STATE = {
  left: 0,
  width: 0,
  height: 0,
  open: false,
}

@store
class ViewStore {
  // TODO proxySetters should auto-type this
  // shortcuts
  orbitState: ViewStore['state']['orbitState']
  authState: ViewStore['state']['authState']
  appsState: ViewStore['state']['appsState']
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
        Pin: DEFAULT_MENU_STATE,
        Orbit: DEFAULT_MENU_STATE,
        Memory: DEFAULT_MENU_STATE,
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

  animationDuration = 90

  getAppState(id: number): AppState {
    return this.state.appsState.find(x => x.id === id)
  }

  get orbitOnLeft() {
    if (App.orbitState.docked) {
      return true
    }
    return App.orbitState.orbitOnLeft
  }

  get orbitArrowTowards() {
    return App.orbitState.orbitOnLeft ? 'right' : 'left'
  }

  get hoveredWordName() {
    return 'none for now'
  }

  start = async (options?) => {
    await Bridge.start(this, this.state, options)
  }
}

App = proxySetters(new ViewStore())
Bridge.stores[App.source] = App
