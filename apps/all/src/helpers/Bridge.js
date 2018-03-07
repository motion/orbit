// @flow
import { store } from '@mcro/black/store'
import { isEqual } from 'lodash'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import waitPort from 'wait-port'

const log = debug('Bridge')

@store
class Bridge {
  _store = null
  _options = {}
  _queuedState = false
  _wsOpen = false
  _source = ''
  _initialState = []

  // to be set once they start
  stores = {}

  socket = new ReconnectingWebSocket('ws://localhost:40510', undefined, {
    constructor: WebSocket,
  })

  get state() {
    return this._store.state
  }

  get storeName() {
    return `${this._store.constructor.name}`
  }

  // note: you have to call start to make it explicitly connect
  start = async (store, initialState, options = {}) => {
    if (!store) {
      throw new Error(`No source given for starting screen store`)
    }
    if (this.store || this.ws) {
      throw new Error(`Already started`)
    }
    this._source = store.constructor.name
    console.log('store.constructor.name', store.constructor.name)
    this._store = store
    // set this.stores.[Desktop|App|Electron]
    this.stores[this._source] = this._store
    this._options = options
    // set initial state synchronously before
    this._initialState = initialState
    if (initialState) {
      log('initialState', initialState)
      this._setState(initialState, true)
    }
    if (typeof window === 'undefined') {
      await waitPort({ host: 'localhost', port: 40510 })
    }
    this.socket.onmessage = ({ data }) => {
      if (!data) {
        console.log(`No data received over socket`)
        return
      }
      try {
        const messageObj = JSON.parse(data)
        if (messageObj && typeof messageObj === 'object') {
          const { source, state } = messageObj
          if (
            this._options.ignoreSource &&
            this._options.ignoreSource[source]
          ) {
            return
          }
          if (!state) {
            throw new Error(`No state received from message: ${data}`)
          }
          if (!source) {
            throw new Error(`No source store
              source: ${source}
              data: ${data}
            `)
          }
          if (!this.stores[source]) {
            console.warn(`Store not imported: ${source}`)
            return
          }
          this._update(this.stores[source].state, state)
        } else {
          throw new Error(`Non-object received`)
        }
      } catch (err) {
        console.log(
          `${err.message}:\n${err.stack}\n
          Bridge error receiving or reacting to message. Initial message:
          ${data}`,
        )
      }
    }
    this.socket.onopen = () => {
      this._wsOpen = true
      // send state that hasnt been synced yet
      if (this._queuedState) {
        this.socket.send(
          JSON.stringify({ state: this.state, source: this._source }),
        )
        this._queuedState = false
      }
    }
    this.socket.onclose = () => {
      this._wsOpen = false
    }
    this.socket.onerror = err => {
      if (this.socket.readyState == 1) {
        console.log('swift ws error', err)
      }
    }
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  _setState = (newState, isInternal = false) => {
    if (!this._store) {
      throw new Error(
        `Called ${this.storeName}.setState before calling ${
          this.storeName
        }.start`,
      )
    }
    if (!newState || typeof newState !== 'object') {
      throw new Error(
        `Bad state passed to ${this.storeName}.setState: ${newState}`,
      )
    }
    // update our own state immediately so its sync
    const changed = this._update(this.state, newState, isInternal)
    if (!this._wsOpen) {
      this._queuedState = true
      return changed
    }
    if (changed.length) {
      console.log('sending source', this.source)
      this.ws.send(JSON.stringify({ state: newState, source: this.source }))
    }
    return changed
  }

  // private
  // return keys of changed items
  _update = (stateObj, newState, isInternal) => {
    log('_update', stateObj, newState, isInternal)
    const changed = []
    for (const key of Object.keys(newState)) {
      if (isInternal && typeof this._initialState[key] === 'undefined') {
        console.error(
          `${this.storeName}._update: tried to set a key not in initialState

            initial state keys: ${JSON.stringify(
              Object.keys(this._initialState),
            )}

            key: ${key}

            value: ${JSON.stringify(newState, 0, 2)}`,
        )
        return changed
      }
      if (!isEqual(stateObj[key], newState[key])) {
        stateObj[key] = newState[key]
        changed.push(key)
      }
    }
    return changed
  }
}

// singleton because
export default new Bridge()
