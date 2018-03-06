// @flow
import { store } from '@mcro/black/store'
import SwiftBridge from './swiftBridge'
import global from 'global'
import { isEqual, difference } from 'lodash'
import setupSocket from './helpers/setupSocket'
import type { DesktopState } from './Desktop'
import * as Helpers from './screenHelpers'

export Desktop from './Desktop'
export Electron from './Electron'
export App from './App'

@store
class Screen {
  desktopState: DesktopState = {
    paused: null,
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

  // state of electron
  electronState = {
    showSettings: null,
    showDevTools: {},
    lastMove: null,
    settingsPosition: [],
    screenSize: [],
    peekFocused: false,
    peekState: {},
    shouldHide: null,
    shouldShow: null,
    shouldPause: null,
  }
  // state of app
  appState = {
    highlightWords: {},
    hoveredWord: null,
    hoveredLine: null,
    peekHidden: null,
    preventElectronHide: null,
    contextMessage: null,
    closePeek: null,
    disablePeek: null,
  }

  // swift state
  swiftState = {}

  // direct connect to the swift process
  swiftBridge: SwiftBridge = new SwiftBridge({
    onStateChange: state => {
      this.swiftState = state
    },
  })

  options = {}
  started = false
  _queuedState = false
  _wsOpen = false
  _source = ''
  _initialStateKeys = []

  // public
  helpers = Helpers

  // note: you have to call start to make it explicitly connect
  start = (source, initialState, options = {}) => {
    if (this.started) {
      throw new Error(`Already started screen`)
    }
    this.options = options
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
    this.uid = Math.random()
    console.log('WE STARTED', source, this.uid)
    this.started = true
    // set initial state synchronously before
    this._initialStateKeys = Object.keys(initialState || {})
    if (initialState) {
      this._setState(initialState)
    }
    setupSocket.call(this)
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  _setState = (state, internal = false) => {
    if (!this.started) {
      throw new Error(`Called Screen.setState before calling Screen.start`)
    }
    if (!state) {
      throw new Error(`No state passed to Screen.setState: ${state}`)
    }
    // update our own state immediately so its sync
    const changed = this._update(this._source, state, internal)
    if (!this._wsOpen) {
      this._queuedState = true
      return changed
    }
    if (changed.length) {
      this.ws.send(JSON.stringify({ state, source: this._source }))
    }
    return changed
  }

  // private
  // return keys of changed items
  _update = (source, state, isInternal) => {
    if (!source) {
      throw new Error(`No source provided in screenStore state update`)
    }
    const changed = []
    const stateObj = this[`${source}State`]
    for (const key of Object.keys(state)) {
      if (isInternal && this._initialStateKeys.indexOf(key) === -1) {
        console.error(
          `Screen.setState: set keys not set in the Screen.start() initial state:
          Initial state keys: ${this._initialStateKeys || `[]`}
          Bad key: ${key}`,
        )
        return changed
      }
      // console.log('isEqual', key, stateObj[key], state[key])
      if (!isEqual(stateObj[key], state[key])) {
        stateObj[key] = state[key]
        changed.push(key)
      }
    }
    return changed
  }
}

// singleton because
const screenStore = new Screen()

// yes were overwriting a global
global.Screen = screenStore

export default screenStore
