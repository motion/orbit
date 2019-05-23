import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { decorate, deep } from '@o/use-store'

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

export type OSThemes = 'dark' | 'light'

@decorate
class DesktopStore {
  // TODO have the store decorator auto-define these types
  // shortcuts
  hoverState: DesktopStore['state']['hoverState']
  appState: DesktopStore['state']['appState']
  ocrState: DesktopStore['state']['ocrState']
  searchState: DesktopStore['state']['searchState']
  keyboardState: DesktopStore['state']['keyboardState']
  mouseState: DesktopStore['state']['mouseState']
  setKeyboardState: DesktopStore['setState']
  setOcrState: DesktopStore['setState']
  setSearchState: DesktopStore['setState']
  setMouseState: DesktopStore['setState']
  setPaused: DesktopStore['setState']
  setLastScreenChange: DesktopStore['setState']

  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Desktop'

  state = deep({
    workspaceState: {
      path: '',
      appIdentifiers: [] as string[],
    },
    appState: {
      id: '',
      name: '',
      title: '',
      offset: [0, 0],
      bounds: [0, 0],
    },
    hoverState: {
      orbitHovered: false,
      menuHovered: false,
      appHovered: {
        0: false,
      },
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
    errorState: {
      title: '',
      message: '',
      type: 'null' as 'warning' | 'error' | 'null',
    },
    searchState: {
      indexStatus: '',
      searchResults: [],
      pluginResults: [],
    },
    keyboardState: {
      isHoldingOption: false,
      escapeDown: Date.now(),
    },
    mouseState: {
      mouseDown: Date.now(),
    },
    onboardState: {
      foundSources: {},
    },
    operatingSystem: {
      theme: 'light' as OSThemes,
      trayBounds: {
        size: [0, 0],
        position: [0, 0],
      },
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

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }

  dispose = Bridge.dispose
}

Desktop = proxySetters(new DesktopStore())
Bridge.stores['Desktop'] = Desktop
