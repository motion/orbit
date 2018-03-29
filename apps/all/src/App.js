// @flow
import Bridge from './helpers/Bridge'
import proxySetters from './helpers/proxySetters'
import { store, react } from '@mcro/black/store'
import global from 'global'
import Desktop from './Desktop'
import Electron from './Electron'
import fuzzySort from 'fuzzysort'
import { Bit } from '@mcro/models'

const isBrowser = typeof window !== 'undefined'
// const log = debug('App')
let App

const presetAnswers = {
  '1.txt': [
    {
      title: 'Hello world',
      body: 'this is me',
      type: 'document',
      integration: 'gdocs',
    },
    {
      title: 'Hello 2',
      body: 'this is me',
      type: 'email',
      integration: 'github',
    },
    { title: 'Chat', body: 'this is me', type: 'chat', integration: 'slack' },
  ],
}

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
    authState: {
      openId: null,
      closeId: null,
    },
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
    return this.bitResults || []
  }

  @react({ fireImmediately: true })
  bitResults = [
    () => [App.state.query, Desktop.appState.id],
    async ([query, id]) => {
      if (!Bit.usedConnection) {
        return
      }
      if (id === 'com.apple.TextEdit') {
        return presetAnswers[Desktop.appState.title]
      }
      if (!query) {
        return (await Bit.find({ take: 8 })) || []
      }
      const results = await Bit.find({
        where: `title like "${query}%"`,
        take: 8,
      })
      const strongTitleMatches = fuzzySort
        .go(query, results, {
          key: 'title',
          threshold: -25,
        })
        .map(x => x.obj)
      return uniq([...strongTitleMatches, ...results])
    },
  ]

  get selectedItem() {
    return App.results[App.state.selectedIndex]
  }

  get isShowingOrbit() {
    return !App.state.orbitHidden
  }

  get isShowingPeek() {
    return (
      !!App.state.peekTarget ||
      (Electron.orbitState.fullScreen && App.isShowingOrbit)
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
  isFullyHidden = [() => !App.isShowingOrbit && !App.isAnimatingOrbit, _ => _]

  @react({ delay: 32, log: isBrowser })
  isFullyShown = [() => App.isShowingOrbit && !App.isAnimatingOrbit, _ => _]

  @react
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
    App.setState({ shouldTogglePinned: Date.now() })
  }

  togglePeek = () => {
    App.setState({ disablePeek: !App.state.disablePeek })
  }

  toggleHidden = () => {
    App.setState({ hidden: !App.state.hidden })
  }

  openSettings = () => {
    App.setState({ openSettings: Date.now() })
  }
}

App = proxySetters(new AppStore())
global.App = App
Bridge.stores[App.source] = App

export default App
