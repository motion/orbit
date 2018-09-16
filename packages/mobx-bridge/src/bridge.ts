import { action } from 'mobx'
import { isPlainObject, debounce, isEqual } from 'lodash'
import RWebSocket from 'reconnecting-websocket'
import WS from './websocket'
import * as Mobx from 'mobx'
import stringify from 'stringify-object'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { SocketManager } from './SocketManager'

const log = new Logger(`bridge ${process.env.PROCESS_NAME || ''}`)

// exports
export * from './proxySetters'
export const WebSocket = WS
export const ReconnectingWebSocket = RWebSocket

const MESSAGE_SPLIT_VAL = '**|**'
const stringifyObject = obj =>
  stringify(obj, {
    indent: '  ',
    singleQuotes: true,
    inlineCharacterLimit: 12,
  })

const isBrowser = typeof window !== 'undefined'
const root = isBrowser ? window : require('global')

// only debounce on browser for fluidity, desktop should be immediate
const runNow = x => (isBrowser ? setImmediate(x) : x())
const immediate = () => new Promise(res => runNow(res))

type Disposer = () => void

type LastMessage = {
  message: string
  value: any
  at: number
}

type Options = {
  master?: Boolean
  ignoreSelf?: Boolean
  stores?: Object
  actions?: {
    [key: string]: Function
  }
}

// we want non-granular updates on state changes
export class BridgeManager {
  port: number
  store: any
  socketManager: SocketManager
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
  private hasFetchedInitialState = false
  // to be set once they are imported
  stores = {}
  messageListeners = new Set()
  lastMessage: LastMessage = null

  get state() {
    return this._store.state
  }

  // note: you have to call start to make it explicitly connect
  start = async (store, initialState, options: Options = {}) => {
    if (!store) {
      throw new Error('No source given for starting screen store')
    }
    this.port = getGlobalConfig().ports.bridge
    // ensure only start once
    if (this.started) {
      throw new Error('Already started this store...')
    }
    this._source = store.source
    this._store = store
    this._options = options
    this.started = true
    if (options.master) {
      await this.setupMaster()
    } else {
      log.info(`Connecting socket to ${this.port}`)
      this._socket = new ReconnectingWebSocket(`ws://localhost:${this.port}`, undefined, {
        constructor: WebSocket,
      })
      this.setupClientSocket()
    }
    // set initial state synchronously before
    this._initialState = JSON.parse(JSON.stringify(initialState))
    if (initialState) {
      this.setState(initialState, true)
    }
    // setup start/quit actions
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.dispose)
    }
    // wait for initial state
    if (!this._options.master) {
      try {
        await Mobx.when(() => this.hasFetchedInitialState, { timeout: 1000 })
        if (!this.hasFetchedInitialState) {
          throw new Error('Timed out fetching initial state!')
        }
      } catch {
        this.hasFetchedInitialState = true
      }
    }
  }

  private async setupMaster() {
    const stores = this._options.stores
    log.verbose(`Starting socket manager on ${this.port}`)
    this.socketManager = new SocketManager({
      masterSource: 'Desktop',
      port: this.port,
      onState: (source, state, uid) => {
        log.verbose(`onState ${uid} ${JSON.stringify(state)}`)
        this.deepMergeMutate(stores[source].state, state, {
          ignoreKeyCheck: true,
        })
      },
      actions: {
        // stores that first connect send a call to get initial state
        // this is where its received by other apps
        getState: ({ /* source,  */ socket }) => {
          for (const name of Object.keys(stores)) {
            this.socketManager.sendState(socket, stores[name].state, name)
          }
        },
        // message coming to Desktop
        onMessage: this.handleMessage,
      },
    })
    await this.socketManager.start()
  }

  setupClientSocket = () => {
    // socket setup
    this._socket.onmessage = async ({ data }) => {
      if (!data) {
        console.log('No data received over socket')
        return
      }
      if (data[0] === '-') {
        this.handleMessage(data.slice(1))
        return
      }
      await immediate()
      try {
        const messageObj = JSON.parse(data)
        if (!messageObj || typeof messageObj !== 'object') {
          throw new Error('Non-object received')
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
          console.warn('Store not imported: this.stores:', this.stores, `source: ${source}`)
          return
        }
        const store = this.stores[source]
        const { state } = store
        if (!state) {
          throw new Error(`No state found for source (${source}) state (${state}) store(${store})`)
        }
        await immediate()
        this.deepMergeMutate(state, newState, { ignoreKeyCheck: true })
        // we have initial state :)
        if (source === this._source && !this.hasFetchedInitialState) {
          this.debounceSetHasFetched()
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
      if (this._awaitingSocket.length) {
        this._awaitingSocket.map(x => x())
        this._awaitingSocket = []
      }
      // send state that hasnt been synced yet
      if (this._queuedState) {
        console.log('opened, sending queued state', this.state)
        try {
          this._socket.send(JSON.stringify({ state: this.state, source: this._source }))
        } catch (err) {
          console.log('error sending initial state', err.message, err.stack)
        }
        this._queuedState = false
      }
      this.getCurrentState()
    }
    this._socket.onclose = () => {
      this._wsOpen = false
      // reconnecting websocket reconnect fix: https://github.com/pladaria/reconnecting-websocket/issues/60
      if (this._socket._shouldReconnect) {
        this._socket._connect()
      }
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

  debounceSetHasFetched = debounce(() => {
    this.hasFetchedInitialState = true
  }, 16)

  getCurrentState = () => {
    // get initial state
    this._socket.send(JSON.stringify({ action: 'getState', source: this._source }))
  }

  handleMessage = data => {
    const getMessage = str => str.split(MESSAGE_SPLIT_VAL)
    const [message, value] = getMessage(data)
    log.info(`Message: ${message}`, value)
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
  setState = (newState, ignoreSend?) => {
    if (!this.started) {
      throw new Error('Not started, can only call setState on the app that starts it.')
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
      throw new Error(`Bad state passed to ${this._source}.setState: ${newState}`)
    }
    // update our own state immediately so its sync
    const changedState = this.deepMergeMutate(this.state, newState)
    if (!ignoreSend) {
      this.sendChangedState(changedState)
    }
    return changedState
  }

  private sendChangedState(changedState: Object) {
    if (changedState) {
      // log.info(`sendChangedState: ${JSON.stringify(changedState)}`)
      if (this._options.master) {
        this.socketManager.sendAll(this._source, changedState)
      } else {
        if (!this._wsOpen) {
          console.log('queueing', changedState)
          this._queuedState = true
          return changedState
        }
        const alreadyQueued = !!this.queuedState.length
        this.queuedState.push({ state: changedState, source: this._source })
        // its already queued to send
        if (!alreadyQueued) {
          runNow(this.sendQueuedState)
        }
      }
    }
  }

  sendQueuedState = () => {
    for (const data of this.queuedState) {
      try {
        this._socket.send(JSON.stringify(data))
      } catch (err) {
        console.log('error sending!', err.message)
        console.log('data is', data)
      }
    }
    this.queuedState = []
  }

  // return keys of changed items
  @action
  deepMergeMutate(
    stateObj: Object,
    newState: Object,
    { ignoreKeyCheck = false, onlyKeys = null } = {}, // ignoreLog?: Boolean,
  ) {
    let changed = null
    for (const key of Object.keys(newState)) {
      if (!ignoreKeyCheck) {
        const isValidKey = onlyKeys
          ? onlyKeys.indexOf(key) > -1
          : this._initialState[key] !== 'undefined'
        if (!isValidKey) {
          console.error(
            `${this._source}.deepMergeMutate: tried to set a key not in initialState
              - key: ${key}
              - typeof initial state key: ${typeof this._initialState[key]}
              - value:
                ${stringifyObject(newState)}
              - initial state:
                ${stringifyObject(this._initialState)}`,
          )
          continue
        }
      }
      // avoid on same object
      const a = Mobx.toJS(stateObj[key])
      const b = Mobx.toJS(newState[key])
      const bothObjects = a && b && isPlainObject(a) && isPlainObject(b)
      if (bothObjects) {
        // check if equal
        const diff = {}
        let areEqual = true
        for (const cKey in b) {
          if (!isEqual(a[cKey], b[cKey])) {
            diff[cKey] = b[cKey]
            // deep mutate thanks mobx5
            stateObj[key][cKey] = b[cKey]
            areEqual = false
          }
        }
        if (areEqual) {
          continue
        }
        changed = changed || {}
        changed[key] = diff
      } else {
        // avoid on same val
        if (a === b || isEqual(a, b)) {
          continue
        }
        stateObj[key] = b
        changed = changed || {}
        changed[key] = b
      }
    }
    if (root.__trackStateChanges && root.__trackStateChanges.isActive) {
      root.__trackStateChanges.changed = changed
    }
    return changed
  }

  onMessage = (type, listener?): Disposer => {
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

  sendMessage = async (Store: any, ogMessage: string, value?: string) => {
    if (!this.started) {
      throw new Error('Not started, can only call sendMessage on the app that starts it.')
    }
    if (!Store || !ogMessage) {
      throw new Error(`no store || message ${Store} ${ogMessage} ${value}`)
    }
    if (typeof Store.source !== 'string') {
      throw new Error(`Bad store.source, store: ${Store}`)
    }
    const message = value ? `${ogMessage}${MESSAGE_SPLIT_VAL}${value}` : ogMessage
    if (this._options.master) {
      this.socketManager.sendMessage(Store.source, message)
    } else {
      if (!this._wsOpen) {
        log.info('\n\n\nWaiting for open socket....\n\n\n')
        await this.onOpenSocket()
        log.info('\n\nSocket opened!\n\n\n')
      }
      // this prevents blockages on sending
      // this would happen when sockets are on desktop side
      // and then any Store.setState call will hang...
      runNow(() => {
        if (process.env.NODE_ENV === 'development') {
          log.trace.verbose(`sendMessage ${message} value ${JSON.stringify(value || null)}`)
        }
        this.lastMessage = { message, value, at: Date.now() }
        this._socket.send(JSON.stringify({ message, to: Store.source }))
      })
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
export const Bridge = new BridgeManager()
