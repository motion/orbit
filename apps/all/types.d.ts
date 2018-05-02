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
  keyboardState: {
    option?: Date
    optionUp?: Date
    shiftUp?: Date
    space?: Date
  }
  ocrState: {
    words?: Array<OCRItem>
    lines?: Array<OCRItem>
    clearWords: { [key: string]: number }
    restoreWords: { [key: string]: number }
  }
  focusedOnOrbit: boolean
  appStateUpdatedAt: number
  searchState: {
    pluginResults: Array<{}>
    indexStatus: string
    searchResults: Array<{}>
  }
}
