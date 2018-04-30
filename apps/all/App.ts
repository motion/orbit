import Bridge from './helpers/Bridge'
import { proxySetters, setGlobal } from './helpers'
import { store, react } from '@mcro/black/store'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import * as Constants from '@mcro/constants'

export let App

// @ts-ignore
const isBrowser = typeof window !== 'undefined'
const isOrbit = isBrowser && window.location.pathname === '/orbit'
// const log = debug('App')

@store
class AppStore {
  messages = {
    TOGGLE_DOCKED: 'TOGGLE_DOCKED',
    TOGGLE_SHOWN: 'TOGGLE_SHOWN',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    HIDE_PEEK: 'HIDE_PEEK',
    PIN: 'PIN',
    UNPIN: 'UNPIN',
    TOGGLE_PINNED: 'TOGGLE_PINNED',
  }

  setState: typeof Bridge.setState
  sendMessage: typeof Bridge.sendMessage
  onMessage: typeof Bridge.onMessage
  bridge: any
  source = 'App'

  state = {
    query: '',
    screenSize: [0, 0],
    orbitState: {
      hidden: true,
      pinned: false,
      docked: false,
      orbitOnLeft: false,
      position: [0, 0],
      size: [0, 0],
    },
    authState: {
      openId: null,
      closeId: null,
    },
    selectedItem: null,
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: 'Orbit',
    peekTarget: null,
  }

  get isShowingOrbit() {
    return !App.orbitState.hidden
  }

  get isShowingPeek() {
    return !!App.state.peekTarget
  }

  animationDuration = 90
  dockedWidth = 550

  @react({ log: false })
  isAnimatingOrbit = [
    () => App.isShowingOrbit,
    async (_, { sleep, setValue }) => {
      setValue(true)
      await sleep(App.animationDuration)
      setValue(false)
    },
  ]

  // debounced a little to prevent aggressive reactions
  @react({ delay: 32, log: isOrbit })
  isFullyHidden = [() => !App.isShowingOrbit && !App.isAnimatingOrbit, _ => _]

  @react({ delay: 32, log: isOrbit })
  isFullyShown = [() => App.isShowingOrbit && !App.isAnimatingOrbit, _ => _]

  // runs in every app independently
  @react({ fireImmediately: true, log: false })
  isMouseInActiveArea = [
    () => !!(Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered),
    async (over, { sleep, setValue }) => {
      await sleep(over ? 0 : 100)
      setValue(over)
    },
  ]

  last: Boolean

  @react({ log: false })
  wasShowingPeek = [
    () => App.isShowingPeek,
    is => {
      if (is === false) {
        return false
      }
      const last = this.last
      this.last = is
      return is || last || false
    },
  ]

  get orbitOnLeft() {
    if (App.orbitState.orbitDocked) {
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

  get aboutToShow() {
    return App.isAnimatingOrbit && App.orbitState.hidden
  }

  start = options => {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.sendMessage = Bridge.sendMessage
    this.onMessage = Bridge.onMessage
    this.bridge = Bridge
  }

  open = async url => {
    App.sendMessage(Desktop, Desktop.messages.OPEN, url)
    App.setOrbitState({ hidden: true })
  }

  togglePinned = () => {
    App.sendMessage(Electron, Electron.messages.TOGGLE_PINNED)
  }

  togglePeek = () => {
    App.setState({ disablePeek: !App.state.disablePeek })
  }

  toggleHidden = () => {
    App.setOrbitState({ hidden: !App.orbitState.hidden })
  }

  openSettings = () => {
    App.setState({ openSettings: Date.now() })
  }
}

App = proxySetters(new AppStore())
setGlobal('App', App)
Bridge.stores[App.source] = App
