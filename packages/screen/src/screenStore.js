// @flow
import { store } from '@mcro/black/store'
import SwiftBridge from './swiftBridge'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import _waitForPort from 'wait-for-port'
import global from 'global'
import { isEqual } from 'lodash'

const waitForPort = (domain, port) =>
  new Promise((res, rej) =>
    _waitForPort(domain, port, err => (err ? rej(err) : res())),
  )

export SwiftBridge from './swiftBridge'

@store
class ScreenStore {
  // things we expect to by synced must be defined here
  // state of electron
  electronState = {
    peekState: {},
    showDevTools: null,
    restart: null,
    loadSettings: null,
    showSettings: null,
    showSettingsDevTools: null,
    size: null,
    settingsPosition: null,
    oraPosition: null,
    lastMove: null,
  }

  // state of app
  appState = {
    pinned: false,
    hidden: false,
    preventElectronHide: true,
    contextMessage: 'Orbit',
    hoveredWord: null,
  }

  // state of api
  desktopState = {
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastScreenChange: null,
    lastOCR: null,
    mousePosition: {},
    keyboard: {},
    highlightWords: {},
    clearWords: {},
    restoreWords: {},
  }

  // swift state
  swiftState = {}

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

  // public

  // note: you have to call start to make it explicitly connect
  async start(source: String) {
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
          if (source === this._source) {
            return // we already updated in setState
          }
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
        this.setState(object)
      }
      this._queuedState = []
    }
    this.ws.onclose = () => {
      this._wsOpen = false
    }
    this.ws.onerror = err => {
      if (err.code === 'ECONNREFUSED') return
      if (err.message.indexOf('ERR_CONNECTION_REFUSED')) return
      console.log('screenStore error', err)
    }
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  setState(state: Object) {
    if (!this._wsOpen) {
      this._queuedState.push(state)
      return
    }
    // update our own state immediately so its sync
    if (this._update(this._source, state)) {
      this.ws.send(JSON.stringify({ state, source: this._source }))
    }
    return this[`${this._source}State`]
  }

  // private
  // return true if new value
  _update = (source: string, state: Object) => {
    if (!source) {
      throw new Error(`No source provided in screenStore state update`)
    }
    let didUpdate = false
    for (const key of Object.keys(state)) {
      const stateObj = this[`${source}State`]
      if (!isEqual(stateObj[key], state[key])) {
        stateObj[key] = state[key]
        didUpdate = true
      }
    }
    return didUpdate
  }
}

// singleton because

const screenStore = new ScreenStore()
global.screenStore = screenStore

export default screenStore
