// @flow
import { store } from '@mcro/black/store'
import { mergeWith, isPlainObject } from 'lodash'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import waitPort from 'wait-port'
import * as Mobx from 'mobx'
import stringify from 'stringify-object'
import global from 'global'

const log = debug('Bridge')

const stringifyObject = obj =>
  stringify(obj, {
    indent: '  ',
    singleQuotes: true,
    inlineCharacterLimit: 12,
  })

// const log = debug('Bridge')
const requestIdle = () =>
  new Promise(
    res =>
      typeof window !== 'undefined' ? window.requestIdleCallback(res) : res(),
  )

class Bridge {
  _store = null
  _options = {}
  _queuedState = false
  _wsOpen = false
  _source = ''
  _initialState = {}
  _socket = null
  // to be set once they are imported
  stores = {}

  get state() {
    return this._store.state
  }

  // note: you have to call start to make it explicitly connect
  start = async (store, initialState, options = {}) => {
    if (!store) {
      throw new Error(`No source given for starting screen store`)
    }
    if (this.store || this._socket) {
      console.warn(`Already started ${this._source}`)
      return
    }
    this._socket = new ReconnectingWebSocket(
      'ws://localhost:40510',
      undefined,
      {
        constructor: WebSocket,
      },
    )
    this._source = store.source
    this._store = store
    this._options = options
    // set initial state synchronously before
    this._initialState = JSON.parse(JSON.stringify(initialState))
    if (initialState) {
      this.setState(initialState, false)
    }
    // setup start/quit actions
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.dispose)
    } else {
      await waitPort({ host: 'localhost', port: 40510 })
      process.on('exit', this.dispose)
    }
    // socket setup
    this._socket.onmessage = async ({ data }) => {
      await requestIdle()
      if (!data) {
        console.log(`No data received over socket`)
        return
      }
      try {
        const messageObj = JSON.parse(data)
        if (messageObj && typeof messageObj === 'object') {
          const { source, state: newState } = messageObj
          if (this._options.ignoreSelf && source === this._source) {
            return
          }
          if (!newState) {
            throw new Error(`No state received from message: ${data}`)
          }
          if (!source) {
            throw new Error(`No source store
              source: ${source}
              data: ${data}
            `)
          }
          if (!this.stores[source]) {
            console.warn(
              `Store not imported: this.stores:`,
              this.stores,
              `source: ${source}`,
            )
            return
          }
          const store = this.stores[source]
          const { state } = store
          if (!state) {
            throw new Error(
              `No state found for source (${source}) state (${state}) store(${store})`,
            )
          }
          await requestIdle()
          this._update(state, newState)
        } else {
          throw new Error(`Non-object received`)
        }
      } catch (err) {
        console.error(
          `${err.message}:\n${err.stack}\n
          Bridge error receiving or reacting to message. Initial message:
          ${data}`,
        )
      }
    }
    this._socket.onopen = () => {
      this._wsOpen = true
      // send state that hasnt been synced yet
      if (this._queuedState) {
        console.log('sending queued state', this._source)
        this._socket.send(
          JSON.stringify({ state: this.state, source: this._source }),
        )
        this._queuedState = false
      }
      // get initial state
      this._socket.send(
        JSON.stringify({ action: 'getState', source: this._source }),
      )
    }
    this._socket.onclose = () => {
      this._wsOpen = false
    }
    this._socket.onerror = err => {
      if (err.preventDefault) {
        err.preventDefault()
        err.stopPropagation()
      }
      if (this._socket.readyState == 1) {
        console.log('swift ws error', err)
      } else {
        console.log('socket err', err)
      }
    }
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  setState = (newState, ignoreSocketSend) => {
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
    const changedState = this._update(
      this.state,
      newState,
      true,
      ignoreSocketSend,
    )
    if (ignoreSocketSend) {
      return changedState
    }
    if (!this._wsOpen) {
      this._queuedState = true
      return changedState
    }
    if (Object.keys(changedState).length) {
      this._socket.send(
        JSON.stringify({ state: changedState, source: this._source }),
      )
    }
    return changedState
  }

  // private
  // return keys of changed items
  _update = (stateObj, newState, isInternal, ignoreLog) => {
    const changed = {}
    for (const key of Object.keys(newState)) {
      if (isInternal && typeof this._initialState[key] === 'undefined') {
        console.error(
          `${this._source}._update: tried to set a key not in initialState
            - initial state:
              ${stringifyObject(this._initialState, 0, 2)}
            - key: ${key}
            - typeof initial state key: ${typeof this._initialState[key]}
            - value:
              ${stringifyObject(newState, 0, 2)}`,
        )
        return changed
      }
      if (!Mobx.comparer.structural(stateObj[key], newState[key])) {
        const oldVal = Mobx.toJS(stateObj[key])
        const newVal = Mobx.toJS(newState[key])
        if (isPlainObject(oldVal) && isPlainObject(newVal)) {
          // merge plain objects
          const newState = mergeWith(oldVal, newVal, (prev, next) => {
            // avoid inner array merge, just replace
            if (Array.isArray(prev) || Array.isArray(next)) {
              return next
            }
          })
          stateObj[key] = newState
          // minimal change diff
          const diff = {}
          for (const key of Object.keys(newVal)) {
            diff[key] = Mobx.toJS(newState[key])
          }
          changed[key] = diff
        } else {
          stateObj[key] = newVal
          changed[key] = newVal
        }
      }
    }
    if (global.__trackStateChanges && global.__trackStateChanges.isActive) {
      global.__trackStateChanges.changed = changed
    } else {
      if (process.env.NODE_ENV === 'development') {
        if (!ignoreLog && isInternal && Object.keys(changed).length) {
          log(`${this._source.replace('Store', '')}.setState =>`, changed)
        }
      }
    }
    return changed
  }

  dispose = () => {
    console.log('disposing websocket cleanly...')
    this._socket.close()
  }
}

// singleton because
export default new Bridge()
