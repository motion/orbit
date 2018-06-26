import Bridge, { proxySetters } from '@mcro/mobx-bridge'
import { setGlobal } from './helpers'
import { store, react, deep } from '@mcro/black/store'
import { Desktop } from './Desktop'

export let App

// @ts-ignore
const isBrowser = typeof window !== 'undefined'
const isOrbit = isBrowser && window.location.pathname === '/orbit'
// const log = debug('App')

@store
class AppStore {
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

  state = deep({
    query: '',
    screenSize: [0, 0],
    orbitState: {
      hidden: true,
      pinned: false,
      docked: true,
      orbitOnLeft: false,
      position: [0, 0],
      size: [0, 0],
    },
    peekState: {
      target: null,
      item: null,
      id: 0,
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
  dockedWidth = 550

  // debounced a little to prevent aggressive reactions
  isFullyHidden = react(
    () => !App.isShowingOrbit && !App.orbitState.docked,
    _ => _,
    { delay: 32, log: isOrbit },
  )

  // runs in every app independently
  isMouseInActiveArea = react(
    () => !!(Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered),
    async (over, { sleep, setValue }) => {
      await sleep(over ? 0 : 100)
      setValue(over)
    },
    { immediate: true },
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
  }

  open = async url => {
    App.sendMessage(Desktop, Desktop.messages.OPEN, url)
    App.setOrbitState({ hidden: true, docked: false })
  }

  togglePinned = () => {
    App.setOrbitState({ pinned: !App.orbitState.pinned })
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
