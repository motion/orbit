export type AppState = {
  id?: string
  name?: string
  title?: string
  offset: [number, number]
  bounds: [number, number]
  selectedText?: string
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
  screenSize: [number, number]
  paused: boolean
  appState?: AppState
  lastScreenChange: number
  lastAppChange: number
  hoverState: {
    orbitHovered: boolean
    peekHovered: boolean
  }
  mouseState: {
    mouseDown?: { x: number; y: number; at: number }
  }
  operatingSystem: {
    isAccessible: boolean
    macVersion?: string
  }
  keyboardState: {
    option?: number
    optionUp?: number
    shiftUp?: number
    space?: number
  }
  ocrState: {
    words?: Array<OCRItem>
    lines?: Array<OCRItem>
    clearWords: { [key: string]: number }
    restoreWords: { [key: string]: number }
  }
  focusedOnOrbit: boolean
  appStateUpdatedAt: number
  lastBitUpdatedAt: number
  searchState: {
    pluginResults: Array<{}>
    indexStatus: string
    searchResults: Array<{}>
  }
}
