import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'

// store export
export let Desktop = null as DesktopStore

// const log = debug('Desktop')
const PAD_WINDOW = 15

export type DesktopStateOCRItem = [
  // x, y, width, height, word, index, color
  number,
  number,
  number,
  number,
  string,
  number,
  string
]

export type AppFocusState = {
  [key: number]: { focused: boolean } | null
}

// @ts-ignore
@store
class DesktopStore {
  // TODO have the store decorator somehow auto-define these types
  // shortcuts
  appState: DesktopStore['state']['appState']
  ocrState: DesktopStore['state']['ocrState']
  searchState: DesktopStore['state']['searchState']
  keyboardState: DesktopStore['state']['keyboardState']
  mouseState: DesktopStore['state']['mouseState']
  setKeyboardState: DesktopStore['setState']
  setAppState: DesktopStore['setState']
  setOcrState: DesktopStore['setState']
  setSearchState: DesktopStore['setState']
  setMouseState: DesktopStore['setState']
  setPaused: DesktopStore['setState']
  setLastScreenChange: DesktopStore['setState']
  setLastBitUpdatedAt: DesktopStore['setState']

  messages = {
    TOGGLE_PAUSED: 'TOGGLE_PAUSED',
    OPEN: 'OPEN',
    CLEAR_OPTION: 'CLEAR_OPTION',
    DEFOCUS_ORBIT: 'DEFOCUS_ORBIT',
    RESET_DATA: 'RESET_DATA',
    SEARCH_INDEX: 'SEARCH_INDEX',
  }

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Desktop'

  state = deep({
    appState: {
      selectedText: '',
      id: '',
      name: '',
      title: '',
      offset: [0, 0],
      bounds: [0, 0],
    },
    ocrState: {
      words: null as DesktopStateOCRItem[],
      lines: null as DesktopStateOCRItem[],
      shouldClear: [],
      clearWords: null,
      restoreWords: null,
    },
    searchState: {
      indexStatus: '',
      searchResults: [],
      pluginResults: [],
    },
    keyboardState: {
      option: 0,
      optionUp: 1,
      space: 0,
      shiftUp: 0,
    },
    mouseState: {
      mouseDown: Date.now(),
    },
    onboardState: {
      foundIntegrations: {},
    },
    operatingSystem: {
      isAccessible: false,
      macVersion: null,
      supportsTransparency: false,
    },
    appFocusState: {} as AppFocusState,
    paused: true,
    focusedOnOrbit: false,
    appStateUpdatedAt: Date.now(),
    lastBitUpdatedAt: Date.now(),
    lastScreenChange: Date.now(),
    lastAppChange: Date.now(),
    movedToNewSpace: 0,
    lastSQLError: '',
  })

  results = []

  get isHoldingOption(): Boolean {
    if (Desktop.mouseState.mouseDown) {
      return false
    }
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
      maxX = Math.min(offset[0] + bounds[0] - PAD_WINDOW * 2 /* reverse linepad */, maxX)
    }
    return { left, top, width: maxX - left, height: maxY - top }
  }

  get activeOCRWords() {
    if (!Desktop.ocrState.shouldClear) {
      return Desktop.ocrState.words || []
    }
    return (Desktop.ocrState.words || []).filter((_, index) => !Desktop.ocrState.shouldClear[index])
  }

  start = async options => {
    await Bridge.start(this, this.state, options)
  }
}

Desktop = proxySetters(new DesktopStore())
Bridge.stores[Desktop.source] = Desktop
