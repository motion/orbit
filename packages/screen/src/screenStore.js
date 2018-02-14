// @flow
import { store } from '@mcro/black/store'
import SwiftBridge from './swiftBridge'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import _waitForPort from 'wait-for-port'
import global from 'global'
import { isEqual, difference } from 'lodash'

const waitForPort = (domain, port) =>
  new Promise((res, rej) =>
    _waitForPort(domain, port, err => (err ? rej(err) : res())),
  )

type TappState = {
  name: string,
  offset: [Number, Number],
  bounds: [Number, Number],
  screen: [Number, Number],
}

type Word = {
  word: string,
  weight: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
}

export type DesktopState = {
  appState?: TappState,
  ocrWords?: [Word],
  linePositions?: [Number],
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: { x: Number, y: Number },
  keyboard: Object,
  highlightWords: { [String]: boolean },
  clearWords: { [String]: Numbe },
  restoreWords: { [String]: Numbe },
}

@store
class Screen {
  // state of electron
  electronState = {
    show: null,
    focused: null,
    restart: null,
    loadSettings: null,
    showSettings: null,
    showDevTools: {},
    lastMove: null,
    settingsPosition: [],
    size: [],
    screenSize: [],
    oraPosition: [],
    peekState: {},
    shouldHide: null,
  }
  // state of app
  appState = {
    hoveredWord: null,
    hoveredLine: null,
    pinned: null,
    hidden: null,
    preventElectronHide: null,
    contextMessage: null,
    closePeek: null,
    disablePeek: null,
  }
  // state of desktop
  desktopState: DesktopState = {
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastOCR: null,
    lastScreenChange: null,
    mousePosition: {},
    keyboard: {},
    clearWords: {},
    restoreWords: {},
    // some test highlight words
    highlightWords: {},
  }
  // swift state
  swiftState = {}

  // this routes the current app state
  get state() {
    return this[`${this._source}State`]
  }

  // direct connect to the swift process
  swiftBridge = new SwiftBridge({
    onStateChange: state => {
      this.swiftState = state
    },
  })

  _queuedState = []
  _wsOpen = false
  _source = ''
  started = false
  _initialStateKeys = []

  // public

  // note: you have to call start to make it explicitly connect
  start(source, initialState) {
    if (this.started) {
      throw new Error(`Already started screen`)
    }
    if (!source) {
      throw new Error(`No source given for starting screen store`)
    }
    const APP_SOURCE = ['desktop', 'electron', 'app']
    if (APP_SOURCE.indexOf(source) === -1) {
      throw new Error(`Source must match one of the apps: ${APP_SOURCE}`)
    }
    this._source = source
    if (this.ws) {
      console.log('already started')
      return
    }
    this.started = true
    // set initial state synchronously before
    if (initialState) {
      this._initialStateKeys = Object.keys(initialState)
      this.setState(initialState)
    }
    this._setupSocket()
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  setState(state, internal = false) {
    if (!this.started) {
      throw new Error(`Called Screen.setState before calling Screen.start`)
    }
    // update our own state immediately so its sync
    const changed = this._update(this._source, state, internal)
    // safety: only set what you start with
    const outOfBoundsKeys = difference(changed, this._initialStateKeys)
    if (outOfBoundsKeys.length) {
      throw new Error(
        `Screen.setState: set keys not set in the Screen.start() initial state: ${outOfBoundsKeys}`,
      )
    }
    if (!this._wsOpen) {
      this._queuedState.push(state)
      return []
    }
    if (changed.length) {
      this.ws.send(JSON.stringify({ state, source: this._source }))
    }
    return changed
  }

  // private
  // return keys of changed items
  _update = (source, state) => {
    if (!source) {
      throw new Error(`No source provided in screenStore state update`)
    }
    const changed = []
    for (const key of Object.keys(state)) {
      const stateObj = this[`${source}State`]
      if (!isEqual(stateObj[key], state[key])) {
        stateObj[key] = state[key]
        changed.push(key)
      }
    }
    return changed
  }

  _setupSocket = async () => {
    if (typeof window === 'undefined') {
      await waitForPort('localhost', 40510)
    }
    this.ws = new ReconnectingWebSocket('ws://localhost:40510', undefined, {
      constructor: WebSocket,
    })
    this.ws.onmessage = ({ data }) => {
      if (!data) {
        console.log(`No data received over socket`)
        return
      }
      try {
        const messageObj = JSON.parse(data)
        if (messageObj && typeof messageObj === 'object') {
          const { source, state } = messageObj
          this._update(source, state)
        } else {
          throw new Error(`Non-object received`)
        }
      } catch (err) {
        console.log(
          `ScreenStore error receiving message: ${
            err.message
          } from data ${data}`,
        )
      }
    }
    this.ws.onopen = () => {
      this._wsOpen = true
      for (const object of this._queuedState) {
        this.setState(object, true)
      }
      this._queuedState = []
    }
    this.ws.onclose = () => {
      this._wsOpen = false
    }
    this.ws.onerror = err => {
      if (err.code === 'ECONNREFUSED') return
      if (err.message && err.message.indexOf('ERR_CONNECTION_REFUSED')) return
      console.log('screenStore error', err)
    }
  }
}

// singleton because
const screenStore = new Screen()

// yes were overwriting a global
global.Screen = screenStore

export default screenStore

export const desktopState = screenStore.desktopState
export const appState = screenStore.appState
export const electronState = screenStore.electronState
export const swiftState = screenStore.swiftState
