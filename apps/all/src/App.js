// @flow
import Bridge from './helpers/Bridge'
import proxySetters from './helpers/proxySetters'
import { store, react } from '@mcro/black/store'
import global from 'global'
import Desktop from './Desktop'
import Electron from './Electron'
import fuzzySort from 'fuzzysort'

const isBrowser = typeof window !== 'undefined'
// const log = debug('App')
let App

const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.title]) {
      final.push(item)
      added[item.title] = true
    }
  }
  return final
}

@store
class AppStore {
  source = 'App'

  state = {
    query: '',
    selectedIndex: null,
    openResult: null,
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    contextMessage: 'Orbit',
    orbitHidden: true,
    knowledge: null,
    peekTarget: null,
    shouldTogglePinned: null,
  }

  fuzzySort = fuzzySort

  get results() {
    const strongTitleMatches = fuzzySort
      .go(this.state.query, Desktop.results, {
        key: 'title',
        threshold: -11,
      })
      .map(x => x.obj)
    return uniq([...strongTitleMatches, ...Desktop.results])
  }

  get selectedItem() {
    return this.results[this.state.selectedIndex]
  }

  get isShowingOrbit() {
    return !App.state.orbitHidden
  }

  get isShowingPeek() {
    return (
      !!App.state.peekTarget ||
      (Electron.orbitState.fullScreen && this.isShowingOrbit)
    )
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
  @react({ delay: 32, log: isBrowser })
  isFullyHidden = [() => !this.isShowingOrbit && !this.isAnimatingOrbit, _ => _]

  @react({ delay: 32, log: isBrowser })
  isFullyShown = [() => this.isShowingOrbit && !this.isAnimatingOrbit, _ => _]

  @react
  wasShowingPeek = [
    () => this.isShowingPeek,
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

  get isShowingHeader() {
    return (
      Electron.orbitState.fullScreen ||
      Electron.orbitState.mouseOver ||
      Electron.orbitState.pinned ||
      false
    )
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
    this.bridge = Bridge
  }

  runReactions() {
    // hmr protect
    if (this.reactions) return
    const AppReactions = require('./AppReactions').default
    this.reactions = new AppReactions()
  }

  togglePinned = () => {
    this.setState({ shouldTogglePinned: Date.now() })
  }

  togglePeek = () => {
    this.setState({ disablePeek: !this.state.disablePeek })
  }

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  openSettings = () => {
    this.setState({ openSettings: Date.now() })
  }
}

App = proxySetters(new AppStore())
global.App = App
Bridge.stores[App.source] = App

export default App
