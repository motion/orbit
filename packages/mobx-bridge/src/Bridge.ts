import { action } from 'mobx'
import { isPlainObject, isEqual } from 'lodash'
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
const nextCycleCb = x => (isBrowser ? setImmediate(x) : x())
const nextCycle = () => new Promise(nextCycleCb)
const bothObjects = (a, b) =>
  a &&
  b &&
  (isPlainObject(a) || Mobx.isObservableObject(a)) &&
  (isPlainObject(b) || Mobx.isObservableObject(b))

const diffDeep = (a: Object, b: Object, opts: { merge?: boolean; returnDiff?: boolean } = {}) => {
  const { merge, returnDiff } = opts
  const diff = {}
  // calculate diff for smaller syncs, need to test perf
  for (const bKey in b) {
    const aVal = a[bKey]
    const bVal = b[bKey]
    // deep diff only objects
    if (bothObjects(aVal, bVal)) {
      const subDiff = diffDeep(aVal, bVal, opts)
      if (returnDiff && subDiff) {
        diff[bKey] = subDiff
      }
    } else {
      if (!isEqual(aVal, bVal)) {
        diff[bKey] = bVal
        if (merge) {
          a[bKey] = bVal
        }
      }
    }
  }
  if (!returnDiff || !Object.keys(diff).length) {
    return null
  }
  return diff
}

type Disposer = () => void

type LastMessage = {
  message: string
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
      this._socket = new ReconnectingWebSocket(`ws://localhost:${this.port}`, [], {
        WebSocket,
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
        await Mobx.when(() => this.hasFetchedInitialState, { timeout: 3000 })
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
      onState: (source, state) => {
        diffDeep(stores[source].state, state, { merge: true })
      },
      actions: {
        // stores that first connect send a call to get initial state
        // this is where its received by other apps
        getInitialState: ({ socket }) => {
          const initialState = {}
          for (const name in stores) {
            initialState[name] = stores[name].state
          }
          this.socketManager.sendInitialState(socket, initialState)
        },
        // message coming to Desktop
        onMessage: this.handleMessage,
      },
    })
    await this.socketManager.start()
  }

  setupClientSocket = () => {
    this._socket.onmessage = async ({ data }) => {
      if (!data) {
        console.log('No data received over socket')
        return
      }
      if (data[0] === '-') {
        this.handleMessage(data.slice(1))
        return
      }
      try {
        const msg = JSON.parse(data)
        console.log('got msg', msg)

        if (!msg || typeof msg !== 'object') {
          throw new Error('Non-object received')
        }

        // receive the current state once we connect to master
        if (msg.initialState) {
          for (const name in msg.initialState) {
            diffDeep(this.stores[name].state, msg.initialState[name], { merge: true })
          }
          this.hasFetchedInitialState = true
          return
        }

        // otherwise we are receiving a single state update

        // ignore self if we want that
        if (this._options.ignoreSelf && msg.source === this._source) {
          return
        }

        if (!msg.state) {
          throw new Error(`No state received from message: ${data}`)
        }
        if (!msg.source) {
          throw new Error(`No source store
            source: ${msg.source}
            data: ${data}
          `)
        }
        if (!this.stores[msg.source]) {
          console.warn('Store not imported: this.stores:', this.stores, `source: ${msg.source}`)
          return
        }

        const store = this.stores[msg.source]
        if (!store.state) {
          throw new Error(
            `No state found for source (${msg.source}) state (${store.state}) store(${store})`,
          )
        }

        // this greatly speeds up client apps
        await nextCycle()

        // apply incoming state
        diffDeep(store.state, msg.state, { merge: true })
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
      this.scheduleSendState()
      this.getInitialState()
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

  getInitialState = () => {
    // get initial state
    this._socket.send(JSON.stringify({ action: 'getInitialState', source: this._source }))
  }

  handleMessage = data => {
    const getMessage = str => str.split(MESSAGE_SPLIT_VAL)
    const [message, value] = getMessage(data)
    // orbit so we can time between other things in the app...
    log.timer('orbit', `${this._source}.message`, `${message}`, value)
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
    if (process.env.NODE_ENV === 'development') {
      if (!newState || typeof newState !== 'object') {
        throw new Error(`Bad state passed to ${this._source}.setState: ${newState}`)
      }
    }
    // update our own state immediately so its sync
    const changedState = this.updateStateWithDiff(this.state, newState)
    if (process.env.NODE_ENV === 'development') {
      if (changedState) {
        log.verbose('setState', newState, 'changedState', changedState)
      }
    }
    if (!ignoreSend && changedState) {
      this.sendChangedState(changedState)
    }
    return changedState
  }

  private sendChangedState(changedState: Object) {
    if (this._options.master) {
      this.socketManager.sendAll(this._source, changedState)
      return
    }
    // log.info(`sendChangedState: ${JSON.stringify(changedState)}`)
    const hasQueued = !!this.queuedState.length
    this.queuedState.push(changedState)
    if (!hasQueued) {
      this.scheduleSendState()
    }
  }

  queuedState = []

  private scheduleSendState() {
    setImmediate(() => {
      const data = this.queuedState
      this.queuedState = []
      this.sendQueuedState(data)
    })
  }

  sendQueuedState = queue => {
    const message = { state: queue[0], source: this._source }
    // multiple state messages could have come in so lets merge it
    if (queue.length > 1) {
      // apply the rest of the queued state to make one data object to send
      for (let i = 0; i < queue.length; i++) {
        diffDeep(message.state, queue[i], { merge: true })
      }
    }
    try {
      this._socket.send(JSON.stringify(message))
    } catch (err) {
      console.log('error sending!', err.message)
      console.log('message is', message)
    }
  }

  // return keys of changed items
  @action
  updateStateWithDiff(
    stateObj: Object,
    newState: Object,
    { ignoreKeyCheck = false, onlyKeys = null } = {}, // ignoreLog?: Boolean,
  ) {
    let changed = null
    for (const key in newState) {
      if (process.env.NODE_ENV === 'development') {
        if (!ignoreKeyCheck) {
          const isValidKey = onlyKeys
            ? onlyKeys.indexOf(key) > -1
            : this._initialState[key] !== 'undefined'
          if (!isValidKey) {
            console.error(
              `${this._source}.updateStateWithDiff: tried to set a key not in initialState
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
      }
      // avoid on same object
      const a = stateObj[key]
      const b = newState[key]
      if (bothObjects(a, b)) {
        // check if equal
        const diff = diffDeep(a, b, { merge: true, returnDiff: true })
        if (!diff) {
          continue
        }
        // then set it as a new object on the root (mobx wont trigger reactions as youd expect unless you do this.)
        // so App.setState({ a: { b:1 } }) triggers reaction in react(() => App.a)
        stateObj[key] = JSON.parse(JSON.stringify(a))
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
    // dev mode tracking state mutations, hacky
    if (process.env.NODE_ENV === 'development') {
      if (root.__trackStateChanges && root.__trackStateChanges.isActive) {
        root.__trackStateChanges.changed = changed
      }
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
      nextCycleCb(() => {
        if (process.env.NODE_ENV === 'development') {
          log.trace.verbose(`sendMessage ${message} value ${JSON.stringify(value || null)}`)
        }
        this.lastMessage = { message, at: Date.now() }
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
