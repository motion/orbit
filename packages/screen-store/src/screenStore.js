// @flow
import { store } from '@mcro/black/store'
import SwiftBridge from './swiftBridge'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import _waitForPort from 'wait-for-port'

const waitForPort = (domain, port) =>
  new Promise((res, rej) =>
    _waitForPort(domain, port, err => (err ? rej(err) : res())),
  )

export SwiftBridge from './swiftBridge'

// this is essentially a proxy store for api/screen
// TODO make this more centralized

@store
export default class ScreenStore {
  // things we expect to by synced must be defined here

  // state of mac windows
  desktopState = null
  // state of electron
  electronState = {}
  // state of app
  appState = {}
  // state of everything else...
  ocrWords = null
  linePositions = null
  lastScreenChange = null
  lastOCR = null
  mousePosition = null
  keyboard = {}
  highlightWords = {}
  clearWords = {}
  restoreWords = {}

  // direct connect to the swift process
  // should safeguard these somehow
  swiftState = null
  swiftBridge = new SwiftBridge({
    onStateChange: state => {
      this.swiftState = state
    },
  })

  _queuedState = []
  _wsOpen = false

  // public

  // note: you have to call start to make it explicitly connect
  async start() {
    console.log('starting screen-store...')
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
      if (data) {
        const res = JSON.parse(data)
        if (res && typeof res === 'object') {
          this._update(res)
        }
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
      console.log('screenStore error', err)
    }
  }

  // this will go up to api and back down to all screen stores
  setState(object: Object) {
    if (!this._wsOpen) {
      this._queuedState.push(object)
      return
    }
    return this.ws.send(JSON.stringify({ state: object }))
  }

  // private
  _update = object => {
    for (const key of Object.keys(object)) {
      this[key] = object[key]
    }
  }
}
