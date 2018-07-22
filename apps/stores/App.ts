import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { store, react, deep } from '@mcro/black/store'
import { Desktop } from './Desktop'

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
}

export type AppState = {
  query: string
  screenSize: [number, number]
  orbitState: {
    hidden: boolean
    pinned: boolean
    docked: boolean
    orbitOnLeft: boolean
    position: [number, number]
    size: [number, number]
    inputFocused: boolean
  }
  peekState: {
    pinned: boolean
    devModeStick: boolean
    target?: {
      top: number
      left: number
      width: number
      height: number
    }
    item?: AppStatePeekItem
    peekId: number
    peekOnLeft: boolean
    position: [number, number]
    size: [number, number]
  }
  authState: {
    openId: null
    closeId: null
  }
  highlightWords: {}
  hoveredWord: null
  hoveredLine: null
  contextMessage: 'Orbit'
}

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
    startOauth: Function
    clearPeek: Function
  }

  messages = {
    TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',
    TOGGLE_DOCKED: 'TOGGLE_DOCKED',
    TOGGLE_SHOWN: 'TOGGLE_SHOWN',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    HIDE_PEEK: 'HIDE_PEEK',
    PIN: 'PIN',
    UNPIN: 'UNPIN',
    TOGGLE_PINNED: 'TOGGLE_PINNED',
  }

  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  bridge: any
  source = 'App'

  state: AppState = deep({
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
    },
    peekState: {
      pinned: false,
      devModeStick: false,
      target: null,
      item: null,
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
  })

  get isShowingOrbit() {
    return !App.orbitState.hidden
  }

  get isShowingPeek() {
    return !!App.peekState.target
  }

  animationDuration = 160
  dockedWidth = 540

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
    () => !!(Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered),
    async (over, { sleep, setValue }) => {
      await sleep(over ? 0 : App.animationDuration)
      setValue(over)
    },
    { immediate: true, log: false },
  )

  last: Boolean

  wasShowingPeek = react(
    () => App.isShowingPeek,
    is => {
      if (is === false) {
        return false
      }
      const last = this.last
      this.last = is
      return is || last || false
    },
  )

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

  open = async url => {
    App.sendMessage(Desktop, Desktop.messages.OPEN, url)
    App.setOrbitState({ hidden: true, docked: false })
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
