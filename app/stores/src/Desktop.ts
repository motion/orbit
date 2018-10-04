import { Bridge, proxySetters } from '@mcro/mobx-bridge'
import { store, deep } from '@mcro/black'
import { App } from './App'

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
  [key: number]: { focused: number | false; exited: boolean } | null
}

// @ts-ignore
@store
class DesktopStore {
  // TODO have the store decorator auto-define these types
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

  messages = {
    TOGGLE_OCR: 'TOGGLE_OCR',
    OPEN: 'OPEN',
    CLEAR_OPTION: 'CLEAR_OPTION',
    RESET_DATA: 'RESET_DATA',
    PROXY_FN: 'PROXY_FN',
  }

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Desktop'

  state = deep({
    appState: {
      id: '',
      name: '',
      title: '',
      offset: [0, 0],
      bounds: [0, 0],
    },
    ocrState: {
      salientWords: null as string[],
      wordsString: null as string,
      words: null as DesktopStateOCRItem[],
      lines: null as DesktopStateOCRItem[],
      shouldClear: [],
      clearWords: null,
      restoreWords: null,
      paused: true,
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
      accessibilityPermission: false,
      macVersion: null,
      supportsTransparency: false,
    },
    appFocusState: {} as AppFocusState,
    focusedOnOrbit: false,
    lastScreenChange: Date.now(),
    lastAppChange: Date.now(),
    movedToNewSpace: 0,
  })

  // takes into account the apps state and finds the app
  // that properly represents Orbit app itself
  // which changes as you tear Peek apps away (see AppsManager or Nate's brain)
  defaultFocus = { focused: false, exited: false }
  get orbitFocusState() {
    const { appFocusState } = Desktop.state
    if (!appFocusState) {
      console.log('orbitFocusState, either no peekApp or no appFocusState')
      return this.defaultFocus
    }
    const focusState = Desktop.state.appFocusState[App.peekState.id]
    if (!focusState) {
      console.log('strange, no focus state for orbit, maybe off a frame')
      return this.defaultFocus
    }
    return focusState
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

  dispose = Bridge.dispose
}

Desktop = proxySetters(new DesktopStore())
Bridge.stores[Desktop.source] = Desktop
