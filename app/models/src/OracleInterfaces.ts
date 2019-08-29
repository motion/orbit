// TODO having this type here is.. weird
// but importing oracle is a nono

export enum OracleMessages {
  trayBounds = 'trayBounds',
  trayHovered = 'trayHovered',
  trayClicked = 'trayClicked',
  windowEvent = 'windowEvent',
  windowChanged = 'windowChanged',
  windowMoved = 'windowMoved',
  windowResized = 'windowResized',
  words = 'words',
  mouseMoved = 'mouseMoved',
}

interface Message {
  action: OracleMessages
  value: any
}

export interface OracleTrayBoundsMessage extends Message {
  action: OracleMessages.trayBounds
  value: {
    position: [number, number]
    size: [number, number]
  }
}

export interface OracleTrayHoveredMessage extends Message {
  action: OracleMessages.trayHovered
  value: {
    id: '0' | '1' | '2' | 'Out'
  }
}

export interface OracleTrayClickedMessage extends Message {
  action: OracleMessages.trayClicked
  value: {
    id: '0' | '1' | '2' | 'Out'
  }
}

export interface OracleMouseMovedMessage extends Message {
  action: OracleMessages.mouseMoved
  value: {
    position: [number, number]
  }
}

export interface OracleWindowChangedMessage extends Message {
  action: OracleMessages.windowChanged
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export interface OracleWindowMovedMessage extends Message {
  action: OracleMessages.windowMoved
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export interface OracleWindowResizedMessage extends Message {
  action: OracleMessages.windowResized
  value: {
    id: number
    title: string
    size: [number, number]
    position: [number, number]
  }
}

export type OracleWordsFound = {
  string: string
  bounds: [number, number, number, number]
}

export interface OracleWordsFoundMessage extends Message {
  action: OracleMessages.words
  value: OracleWordsFound[]
}

export type OracleMessage =
  | OracleMouseMovedMessage
  | OracleTrayClickedMessage
  | OracleTrayHoveredMessage
  | OracleTrayBoundsMessage
  | OracleWindowChangedMessage
  | OracleWindowMovedMessage
  | OracleWindowResizedMessage
  | OracleWordsFoundMessage

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
