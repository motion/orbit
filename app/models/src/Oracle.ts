// TODO having this type here is.. weird
// but importing oracle is a nono

interface Message {
  message: string
}

export interface OracleTrayBoundsMessage extends Message {
  message: 'trayBounds'
  value: {
    position: [number, number]
    size: [number, number]
  }
}

export interface OracleTrayHoveredMessage extends Message {
  message: 'trayHovered'
  value: {
    id: '0' | '1' | '2' | 'Out'
  }
}

export interface OracleMouseMovedMessage extends Message {
  message: 'trayHovered'
  value: {
    position: [number, number]
  }
}

export interface OracleWindowChangedMessage extends Message {
  message: 'windowChanged'
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export interface OracleWindowMovedMessage extends Message {
  message: 'windowMoved'
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export interface OracleWindowResizedMessage extends Message {
  message: 'windowResized'
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export interface OracleWordsFoundMessage extends Message {
  message: 'words'
  value: {
    string: string
    bounds: [number, number, number, number]
  }[]
}

export type OracleMessage =
  | OracleTrayHoveredMessage
  | OracleTrayBoundsMessage
  | OracleMouseMovedMessage
  | OracleWindowChangedMessage
  | OracleWindowMovedMessage
  | OracleWindowResizedMessage
  | OracleWordsFoundMessage

export enum OracleMessages {
  trayBounds = 'trayBounds',
  trayHovered = 'trayHovered',
  trayClicked = 'trayClicked',
  windowEvent = 'windowEvent',
  windowChanged = 'windowChanged',
  windowMoved = 'windowMoved',
  windowResized = 'windowResized',
  words = 'words',
}

export type OracleAction =
  | { action: 'startRecording' }
  | { action: 'stopRecording' }
  | { action: 'setBounds'; value: { x: number; y: number; width: number; height: number } }
  | { action: 'setFPS'; value: { fps: number } }
  | { action: 'startObservingWindows' }
  | { action: 'stopObservingWindows' }

export enum OracleActions {
  startRecording = 'startRecording',
  stopRecording = 'stopRecording',
  setBounds = 'setBounds',
  startObservingWindows = 'startObservingWindows',
  stopObservingWindows = 'stopObservingWindows',
}
