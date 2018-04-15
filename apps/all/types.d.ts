export type AppState = {
  id?: string
  name?: string
  title?: string
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
  paused: boolean
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
