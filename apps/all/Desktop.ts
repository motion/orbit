import Bridge from './helpers/Bridge'
import { setGlobal, proxySetters } from './helpers'
import { store, react } from '@mcro/black/store'
import { DesktopState } from './types'

export let Desktop

// const log = debug('Desktop')
const PAD_WINDOW = 15

@store
class DesktopStore {
  messages = {
    TOGGLE_PAUSED: 'TOGGLE_PAUSED',
    OPEN_AUTH: 'OPEN_AUTH',
    CLOSE_AUTH: 'CLOSE_AUTH',
    OPEN: 'OPEN',
  }

  setState: typeof Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Desktop'

  state: DesktopState = {
    screenSize: [0, 0],
    appState: {
      selectedText: '',
      id: null,
      name: null,
      title: null,
      offset: [0, 0],
      bounds: [0, 0],
    },
    ocrState: {
      words: null,
      lines: null,
      clearWords: null,
      restoreWords: null,
    },
    searchState: {
      indexStatus: '',
      searchResults: [],
      pluginResults: [],
    },
    keyboardState: {},
    hoverState: {
      orbitHovered: false,
      peekHovered: false,
    },
    mouseState: {
      mouseDown: null,
    },
    paused: true,
    focusedOnOrbit: true,
    appStateUpdatedAt: Date.now(),
    lastScreenChange: Date.now(),
    lastAppChange: Date.now(),
  }

  results = []

  @react({ log: false })
  memoizedResults = [
    () => [
      ...Desktop.searchState.searchResults,
      ...Desktop.searchState.pluginResults,
    ],
    x => (this.results = x),
  ]

  get isHoldingOption(): Boolean {
    const { option, optionUp } = Desktop.state.keyboardState
    return (option || 0) > (optionUp || 1)
  }

  get shouldHide() {
    return Desktop.state.lastScreenChange > Desktop.state.appStateUpdatedAt
  }

  get linesBoundingBox() {
    const { lines } = Desktop.ocrState
    if (!lines) return null
    let left = 100000
    let maxX = 0
    let top = 100000
    let maxY = 0
    // found place for window to go
    for (const [lx, ly, lw, lh] of lines) {
      if (lx + lw > maxX) maxX = lx + lw
      if (lx < left) left = lx
      if (ly < top) top = ly
      if (ly + lh > maxY) maxY = ly + lh
    }
    // maxX should never be past right edge of window frame
    // this fixes logical issues in line finding from swift for now
    if (Desktop.appState) {
      const { offset, bounds } = Desktop.appState
      maxX = Math.min(
        offset[0] + bounds[0] - PAD_WINDOW * 2 /* reverse linepad */,
        maxX,
      )
    }
    return { left, top, width: maxX - left, height: maxY - top }
  }

  get activeOCRWords() {
    if (!Desktop.ocrState.shouldClear) {
      return Desktop.ocrState.words || []
    }
    return (Desktop.ocrState.words || []).filter(
      (_, index) => !Desktop.ocrState.shouldClear[index],
    )
  }

  start = options => {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
  }

  // only clear if necessary
  clearOption = () => Desktop.setKeyboardState({ optionUp: Date.now() })
}

Desktop = proxySetters(new DesktopStore())
setGlobal('Desktop', Desktop)
Bridge.stores[Desktop.source] = Desktop
