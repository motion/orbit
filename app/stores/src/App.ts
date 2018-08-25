import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { store, react, deep } from '@mcro/black'
import { Electron } from './Electron'

export let App = null as AppStore

// @ts-ignore
const isBrowser = typeof window !== 'undefined'
const isOrbit = isBrowser && window.location.pathname === '/orbit'
// const log = debug('App')

export type AppStatePeekItem = {
  id: string
  icon: string
  title: string
  body: string
  type: string
  integration: string
  subType: string
  // allow various things to be passed as config
  // to help configure the peek window
  config?: {
    showTitleBar?: boolean
  }
}

// @ts-ignore
@store
class AppStore {
  // shortcuts
  orbitState: AppStore['state']['orbitState']
  peekState: AppStore['state']['peekState']
  authState: AppStore['state']['authState']
  setOrbitState: Function
  setPeekState: Function
  setAuthState: Function

  // TODO: get these onto here
  actions: {
    closeOrbit: Function
    selectItem: Function
    toggleSelectItem: Function
    open: Function
    openItem: Function
    openAuth: Function
    copyLink: Function
    clearPeek: Function
    setPeekTarget: Function
    setContextMessage: Function
    setHighlightIndex: Function
  }

  messages = {
    SHOW_APPS: 'SHOW_APPS',
    TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',
    TOGGLE_DOCKED: 'TOGGLE_DOCKED',
    TOGGLE_SHOWN: 'TOGGLE_SHOWN',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    HIDE_PEEK: 'HIDE_PEEK',
    PIN: 'PIN',
    UNPIN: 'UNPIN',
    TOGGLE_PINNED: 'TOGGLE_PINNED',
    CLEAR_SELECTED: 'CLEAR_SELECTED',
    FORWARD_STATUS: 'FORWARD_STATUS',
  }

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge: any
  source = 'App'

  state = deep({
    query: '',
    screenSize: [0, 0],
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
      item: null as AppStatePeekItem,
      peekId: 0,
      peekOnLeft: false,
      position: [0, 0],
      size: [0, 0],
    },
    authState: {
      openId: null,
      closeId: null,
    },
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: 'Orbit',
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
