import { action } from 'mobx'
import { mergeWith, isPlainObject, isEqual } from 'lodash'
import RWebSocket from 'reconnecting-websocket'
import WS from './websocket'
import * as Mobx from 'mobx'
import stringify from 'stringify-object'
import T_SocketManager from './socketManager'
import debug from '@mcro/debug'

const log = debug('bridge')

// exports
export * from './proxySetters'
export const WebSocket = WS
export const ReconnectingWebSocket = RWebSocket

const root = typeof window !== 'undefined' ? window : require('global')
const MESSAGE_SPLIT_VAL = '**|**'
const stringifyObject = obj =>
  stringify(obj, {
    indent: '  ',
    singleQuotes: true,
    inlineCharacterLimit: 12,
  })
const requestIdle = (cb?: Function) =>
  new Promise(res => setTimeout(cb || res, 0))

type Options = {
  master?: Boolean
  ignoreSelf?: Boolean
  stores?: Object
  actions?: {
    [key: string]: Function
  }
}

// we want non-granular updates on state changes
class Bridge {
  store: any
  socketManager: T_SocketManager
  started = false
  _awaitingSocket = []
  _store = null
  _options: Options
  queuedState = []
  _queuedState = false
  _wsOpen = false
  _source = ''
  _initialState = {}
  _socket = null
  // to be set once they are imported
  stores = {}
  messageListeners = new Set()

  get state() {
    return this._store.state
  }

  // note: you have to call start to make it explicitly connect
  start = async (store, initialState, options: Options = {}) => {
    if (!store) {
      throw new Error(`No source given for starting screen store`)
    }
    if (this.store || this._socket) {
      console.warn(`Already started ${this._source}`)
      return
    }
    store.bridge = this
    this.started = true
    if (options.master) {
      // TODO: once parcel can ignore requires
      const SocketManager = eval(`require('./socketManager')`).default
      const stores = options.stores
      this.socketManager = new SocketManager({
        masterSource: 'Desktop',
        port: 40510,
        onState: (source, state) => {
          log(`onState ${JSON.stringify(state)}`)
          this._update(stores[source].state, state)
        },
        actions: {
          // stores that first connect send a call to get initial state
          // this is where its received by other apps
          getState: ({ source, socket }) => {
            // dont sync you to yourself
            if (source === this._source) return
            for (const name of Object.keys(stores)) {
              this.socketManager.send(socket, stores[name].state, name)
            }
          },
          // message coming to Desktop
          onMessage: this.handleMessage,
        },
      })
      await this.socketManager.start()
    } else {
      this._socket = new ReconnectingWebSocket(
        'ws://localhost:40510',
        undefined,
        {
          constructor: WebSocket,
        },
      )
      this.setupClientSocket()
    }
    this._source = store.source
    this._store = store
    this._options = options
    // define actions onto the store
    // wrap them in mobx actions so we get logging
    if (options.actions) {
      if (store.actions) {
        throw new Error('Actions should be defined through Store.start()')
      }
      store.actions = {}
      for (const key of Object.keys(options.actions)) {
        const actionName = `${store.constructor.name}.${key}`
        const boundAction = options.actions[key].bind(store)
        const finalAction = (...args) => {
          log(`ACTION: ${actionName}`)
          return boundAction(...args)
        }
        store.actions[key] = Mobx.action(actionName, finalAction)
      }
    }
    // set initial state synchronously before
    this._initialState = JSON.parse(JSON.stringify(initialState))
    if (initialState) {
      this.setState(initialState, false)
    }
    // setup start/quit actions
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.dispose)
    } else {
      await eval(`require('wait-port')`)({ host: 'localhost', port: 40510 })
      process.on('exit', this.dispose)
    }
  }

  setupClientSocket = () => {
    // socket setup
    this._socket.onmessage = async ({ data }) => {
      if (!data) {
        console.log(`No data received over socket`)
        return
      }
      if (data[0] === '-') {
        this.handleMessage(data.slice(1))
        return
      }
      await requestIdle()
      try {
        const messageObj = JSON.parse(data)
        if (!messageObj || typeof messageObj !== 'object') {
          throw new Error(`Non-object received`)
        }
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
      if (this._awaitingSocket.length) {
        this._awaitingSocket.map(x => x())
        this._awaitingSocket = []
      }
      // send state that hasnt been synced yet
      if (this._queuedState) {
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
      if (err.code === 'ETIMEDOUT') {
        return
      }
      if (this._socket.readyState == 1) {
        console.log('swift ws error', err)
      } else {
        console.log('socket err', err.message, err.stack)
      }
    }
  }

  handleMessage = data => {
    const getMessage = str => str.split(MESSAGE_SPLIT_VAL)
    const [message, value] = getMessage(data)
    for (const { type, listener } of this.messageListeners) {
      if (!type) {
        listener(message, value)
      } else if (message === type) {
        listener(value)
      }
    }
  }

  onOpenSocket = () => {
    return new Promise(res => {
      this._awaitingSocket.push(res)
    })
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  setState = (newState, ignoreSocketSend) => {
    if (!this.started) {
      throw new Error(
        `Not started, can only call setState on the app that starts it.`,
      )
    }
    if (!this._store) {
      console.warn('waht is this', this, this._source, this._store)
      throw new Error(
        `Called ${this._source}.setState before calling ${
          this._source
        }.start with state ${JSON.stringify(newState, null, 2)}`,
      )
    }
    if (!newState || typeof newState !== 'object') {
      throw new Error(
        `Bad state passed to ${this._source}.setState: ${newState}`,
      )
    }
    // update our own state immediately so its sync
    const changedState = this._update(this.state, newState, true)
    if (ignoreSocketSend) {
      return changedState
    }
    if (Object.keys(changedState).length) {
      log(`changedState:\n\n ${JSON.stringify(changedState, null, 2)}`)
      if (this._options.master) {
        this.socketManager.sendAll(this._source, changedState)
      } else {
        if (!this._wsOpen) {
          console.log('queueing', changedState)
          this._queuedState = true
          return changedState
        }
        // setTimeout to batch sending
        if (!this.queuedState.length) {
          setTimeout(this.sendQueuedState)
        }
        this.queuedState.push({ state: changedState, source: this._source })
      }
    }
    return changedState
  }

  sendQueuedState = () => {
    for (const data of this.queuedState) {
      this._socket.send(JSON.stringify(data))
    }
    this.queuedState = []
  }

  // private
  // return keys of changed items
  @action
  _update(
    stateObj: Object,
    newState: Object,
    isInternal?: Boolean,
    // ignoreLog?: Boolean,
  ) {
    const changed = {}
    for (const key of Object.keys(newState)) {
      if (isInternal && typeof this._initialState[key] === 'undefined') {
        console.error(
          `${this._source}._update: tried to set a key not in initialState
            - key: ${key}
            - typeof initial state key: ${typeof this._initialState[key]}
            - value:
              ${stringifyObject(newState)}
            - initial state:
              ${stringifyObject(this._initialState)}`,
        )
        continue
      }
      // avoid on same object
      const a = Mobx.toJS(stateObj[key])
      const b = Mobx.toJS(newState[key])
      const bothObjects = a && b && isPlainObject(a) && isPlainObject(b)
      if (bothObjects) {
        // check if equal
        let areEqual = true
        for (const key of Object.keys(b)) {
          if (!isEqual(a[key], b[key])) {
            areEqual = false
            break
          }
        }
        if (areEqual) {
          continue
        }
        // merge plain objects
        const newState = mergeWith(a, b, (prev, next) => {
          // avoid inner array merge, just replace
          if (Mobx.isArrayLike(prev) || Mobx.isArrayLike(next)) {
            return next
          }
        })
        // minimal change diff after merge
        const diff = {}
        for (const key of Object.keys(b)) {
          diff[key] = newState[key]
        }
        stateObj[key] = newState
        changed[key] = diff
      } else {
        // avoid on same val
        if (a === b || isEqual(a, b)) {
          continue
        }
        stateObj[key] = b
        changed[key] = b
      }
    }
    if (root.__trackStateChanges && root.__trackStateChanges.isActive) {
      root.__trackStateChanges.changed = changed
    }
    // log(`_update ${JSON.stringify(changed)}`)
    return changed
  }

  onMessage = (type, listener): Function => {
    if (!this.started) {
      // avoid bailing out here as sometimes hmr may interfere
      console.error(
        `Not started, can only call onMessage on the app that starts it.`,
      )
      return
    }
    let subscription = { type, listener }
    if (!listener) {
      subscription = { type: null, listener: type }
    }
    this.messageListeners.add(subscription)
    // return disposable
    return () => {
      this.messageListeners.delete(subscription)
    }
  }

  sendMessage = async (Store: any, ogMessage: string, value: string) => {
    if (!this.started) {
      throw new Error(
        `Not started, can only call sendMessage on the app that starts it.`,
      )
    }
    if (!Store || !ogMessage) {
      throw `no store || message ${Store} ${ogMessage} ${value}`
    }
    const message = value
      ? `${ogMessage}${MESSAGE_SPLIT_VAL}${value}`
      : ogMessage
    if (this._options.master) {
      this.socketManager.sendMessage(Store.source, message)
    } else {
      if (!this._wsOpen) {
        await this.onOpenSocket()
      }
      this._socket.send(JSON.stringify({ message, to: Store.source }))
    }
  }

  dispose = () => {
    if (this._options.master) {
      this.socketManager.dispose()
    } else {
      this._socket.close()
    }
  }
}

// singleton because
export default new Bridge()
