import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'
import { AppConfig } from './AppConfig'

export let App = null as AppStore

// @ts-ignore
const isBrowser = typeof window !== 'undefined'

export const defaultPeekState = {
  id: 0,
  torn: false,
  target: null,
  appConfig: null as AppConfig,
  peekId: 0,
  peekOnLeft: false,
  position: [0, 0],
  size: [0, 0],
}

// @ts-ignore
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
    TOGGLE_SHOWN: 'TOGGLE_SHOWN',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    HIDE_PEEK: 'HIDE_PEEK',
    PIN: 'PIN',
    UNPIN: 'UNPIN',
    TOGGLE_PINNED: 'TOGGLE_PINNED',
    CLEAR_SELECTED: 'CLEAR_SELECTED',
    FORWARD_STATUS: 'FORWARD_STATUS',
    NOTIFICATION: 'NOTIFICATION',
    SEARCH_INDEX_ANSWER: 'SEARCH_INDEX_ANSWER',
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
  })

  get peekState() {
    return this.state.appsState[0]
  }

  animationDuration = 90

  last: Boolean

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

App = proxySetters(new AppStore())
Bridge.stores[App.source] = App
