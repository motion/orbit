import Bridge from './helpers/Bridge'
import { proxySetters, setGlobal } from './helpers'
import { store, react } from '@mcro/black/store'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import AppReactions from './AppReactions'
import * as Constants from '@mcro/constants'

export let App

// @ts-ignore
const isBrowser = typeof window !== 'undefined'
const isOrbit = isBrowser && window.location.pathname === '/orbit'
// const log = debug('App')

@store
class AppStore {
  messages = {
    TOGGLE_SHOWN: 'TOGGLE_SHOWN',
    SHOW: 'SHOW',
    HIDE: 'HIDE',
    HIDE_PEEK: 'HIDE_PEEK',
    PIN: 'PIN',
  }

  setState: typeof Bridge.setState
  sendMessage: typeof Bridge.sendMessage
  onMessage: typeof Bridge.onMessage
  bridge: any
  reactions: AppReactions
  source = 'App'

  state = {
    query: '',
    authState: {
      openId: null,
      closeId: null,
    },
    selectedItem: null,
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: 'Orbit',
    orbitHidden: true,
    peekTarget: null,
  }

  get isShowingOrbit() {
    if (Constants.FORCE_FULLSCREEN) {
      return true
    }
    return !App.state.orbitHidden
  }

  get isShowingPeek() {
    return !!App.state.peekTarget
  }

  animationDuration = 90

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

  get isAttachedToWindow() {
    return !Electron.orbitState.fullScreen && !!Desktop.appState
  }

  get hoveredWordName() {
    return 'none for now'
  }

  get aboutToShow() {
    return App.isAnimatingOrbit && App.state.orbitHidden
  }

  start = options => {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.sendMessage = Bridge.sendMessage
    this.onMessage = Bridge.onMessage
    this.bridge = Bridge
  }

  runReactions(options) {
    // hmr protect
    if (this.reactions) return
    // @ts-ignore
    const AppReactions = require('./AppReactions').default
    this.reactions = new AppReactions(options)
  }

  open = async url => {
    App.sendMessage(Desktop, Desktop.messages.OPEN, url)
    App.setOrbitHidden(true)
  }

  togglePinned = () => {
    App.sendMessage(Electron, Electron.messages.TOGGLE_PINNED)
  }

  togglePeek = () => {
    App.setState({ disablePeek: !App.state.disablePeek })
  }

  toggleHidden = () => {
    App.setState({ orbitHidden: !App.state.orbitHidden })
  }

  openSettings = () => {
    App.setState({ openSettings: Date.now() })
  }
}

App = proxySetters(new AppStore())
setGlobal('App', App)
Bridge.stores[App.source] = App
