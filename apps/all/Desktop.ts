import Bridge from './helpers/Bridge'
import { setGlobal, proxySetters } from './helpers'
import { store, react } from '@mcro/black/store'

export let Desktop

// const log = debug('Desktop')
const PAD_WINDOW = 15

export type AppState = {
  id: string
  name: string
  title: string
  offset: [number, number]
  bounds: [number, number]
}

export type OCRItem = {
  word?: string
  weight: number
  top: number
  left: number
  width: number
  height: number
}

export type DesktopState = {
  appState?: AppState
  lastScreenChange: number
  lastAppChange: number
  mouseState: {
    position: { x: number; y: number }
    mouseDown?: { x: number; y: number; at: number }
  }
  keyboardState: {
    option?: Date
    optionUp?: Date
    shiftUp?: Date
    space?: Date
  }
  highlightWords: { [key: string]: boolean }
  ocrState: {
    words?: [OCRItem]
    lines?: [OCRItem]
    clearWords: { [key: string]: number }
    restoreWords: { [key: string]: number }
  }
  focusedOnOrbit: boolean
  appStateUpdatedAt: number
  searchState: {
    pluginResults: [{}]
    indexStatus: String
    searchResults: [{}]
  }
}

@store
class DesktopStore {
  messages = {
    TOGGLE_PAUSED: 'TOGGLE_PAUSED',
  }

  setState: typeof Bridge.setState
  sendMessage: typeof Bridge.sendMessage
  onMessage: typeof Bridge.onMessage
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
    searchResults: [],
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

  get isHoldingOptionPure(): Boolean {
    const { option, optionUp } = Desktop.state.keyboardState
    return (option || 0) > (optionUp || 1)
  }

  // dont count if holding option+shift (fullscreen)
  get isHoldingOption(): Boolean {
    return this.isHoldingOptionPure && !this.isHoldingShift
  }

  get isHoldingShift() {
    const { shift, shiftUp } = Desktop.state.keyboardState
    return (shift || 0) > (shiftUp || 1)
  }

  get isHoldingOptionShift(): Boolean {
    return this.isHoldingShift && this.isHoldingOptionPure
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
    this.sendMessage = Bridge.sendMessage
    this.onMessage = Bridge.onMessage
  }

  // only clear if necessary
  clearOption = () => Desktop.setKeyboardState({ optionUp: Date.now() })
}

Desktop = proxySetters(new DesktopStore())
setGlobal('Desktop', Desktop)
Bridge.stores[Desktop.source] = Desktop
