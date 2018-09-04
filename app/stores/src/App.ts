import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { store, react, deep } from '@mcro/black'
import { Electron } from './Electron'
import { AppConfig } from './AppConfig'

export let App = null as AppStore

// @ts-ignore
const isBrowser = typeof window !== 'undefined'
const isOrbit = isBrowser && window.location.pathname === '/orbit'

type AppState = {
  id: number
  appConfig: AppConfig
  size: number[]
  position: number[]
}

// @ts-ignore
@store
class AppStore {
  // TODO proxySetters should auto-type this
  // shortcuts
  orbitState: AppStore['state']['orbitState']
  peekState: AppStore['state']['peekState']
  authState: AppStore['state']['authState']
  appsState: AppStore['state']['appsState']
  setOrbitState: Function
  setPeekState: Function
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
  }

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge: any
  source = 'App'

  state = deep({
    query: '',
    screenSize: [0, 0],
    darkTheme: true,
    orbitState: {
      hidden: true,
      pinned: false,
      docked: false,
      orbitOnLeft: false,
      position: [0, 0],
      size: [0, 0],
      inputFocused: false,
      shortcutInputFocused: false,
    },
    peekState: {
      pinned: false,
      devModeStick: false,
      target: null,
      appConfig: null as AppConfig,
      peekId: 0,
      peekOnLeft: false,
      position: [0, 0],
      size: [0, 0],
    },
    appsState: [] as AppState[],
    authState: {
      openId: null,
      closeId: null,
    },
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: '',
    acceptsForwarding: false,
  })

  get isShowingOrbit() {
    return !App.orbitState.hidden
  }

  animationDuration = 90

  // debounced a little to prevent aggressive reactions
  isFullyHidden = react(
    () => !App.isShowingOrbit && !App.orbitState.docked,
    _ => _,
    { delay: 32, log: isOrbit },
  )

  // runs in every app independently
  // this won't trigger until the app is actually finished showing
  // to be more precise for enabling mouse events
  isMouseInActiveArea = react(
    () =>
      !!(Electron.hoverState.orbitHovered || Electron.hoverState.peekHovered),
    async (over, { sleep, setValue }) => {
      await sleep(over ? 0 : App.animationDuration)
      setValue(over)
    },
    { log: false },
  )

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

  start = async options => {
    await Bridge.start(this, this.state, options)
  }

  togglePinned = () => {
    App.setOrbitState({ pinned: !App.orbitState.pinned })
  }

  toggleHidden = () => {
    App.setOrbitState({ hidden: !App.orbitState.hidden })
  }

  openSettings = () => {
    App.setState({ openSettings: Date.now() })
  }
}

App = proxySetters(new AppStore())
Bridge.stores[App.source] = App
