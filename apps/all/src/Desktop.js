// @flow
import Bridge from './helpers/Bridge'
import proxySetters from './helpers/proxySetters'
import { store, react } from '@mcro/black/store'
import global from 'global'

// const log = debug('Desktop')
const PAD_WINDOW = 15

type AppState = {
  id: string,
  name: string,
  offset: [Number, Number],
  bounds: [Number, Number],
}

type OCRItem = {
  word?: string,
  weight: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
}

export type DesktopState = {
  appState?: AppState,
  lastScreenChange: Number,
  lastAppChange: Number,
  mouseState: {
    position: { x: Number, y: Number },
    mouseDown?: { x: Number, y: Number, at: Number },
  },
  keyboardState: Object,
  highlightWords: { [String]: boolean },
  ocrState: {
    words?: [OCRItem],
    lines?: [OCRItem],
    clearWords: { [String]: Number },
    restoreWords: { [String]: Number },
  },
  focusedOnOrbit: boolean,
  appStateUpdatedAt: Number,
  searchState: {
    pluginResults: [{}],
    indexStatus: String,
    searchResults: [{}],
  },
}

let Desktop

@store
class DesktopStore {
  source = 'Desktop'

  state = {
    shouldTogglePin: null,
    appState: {
      id: null,
      name: null,
      offset: [],
      bounds: [],
    },
    ocrState: {
      words: null,
      lines: null,
      clearWords: null,
      restoreWords: null,
      updatedAt: 0,
    },
    searchState: {
      indexStatus: '',
      performance: null,
      searchResults: [],
      pluginResults: [],
    },
    keyboardState: {},
    mouseState: {
      mouseDown: null,
      position: { x: 0, y: 0 },
    },
    selection: null,
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
    const { option, optionUp } = Desktop.keyboardState
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
    return (Desktop.ocrState.words || []).filter(
      (_, index) => !Desktop.ocrState.shouldClear[index],
    )
  }

  start = options => {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState
  }

  // only clear if necessary
  clearOption = () => {
    const { option, optionUp } = this.state
    if (!option || !optionUp || option > optionUp) {
      Desktop.setKeyboardState({ optionUp: Date.now() })
    }
  }
}

Desktop = proxySetters(new DesktopStore())
global.Desktop = Desktop
Bridge.stores[Desktop.source] = Desktop

export default Desktop
