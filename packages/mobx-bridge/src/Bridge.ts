import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { isEqual, isPlainObject } from 'lodash'
import * as Mobx from 'mobx'
import { action } from 'mobx'
import RWebSocket from 'reconnecting-websocket'
import stringify from 'stringify-object'
import { SocketManager } from './SocketManager'
import WS from './websocket'

const log = new Logger(`bridge ${process.env.PROCESS_NAME || ''}`)

// exports
export * from './proxySetters'
export const WebSocket = WS
export const ReconnectingWebSocket = RWebSocket

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

export type BridgeOptions = {
  master?: boolean
  ignoreSelf?: boolean
  waitForInitialState?: boolean
  stores?: Object
  actions?: {
    [key: string]: Function
  }
}

// we want non-granular updates on state changes
export class BridgeManager {
  port: number
  socketManager: SocketManager
  started = false
  // to be set once they are imported
  stores = {}
  messageListeners = new Set<{ type: string; listener: Function }>()
  lastMessage: LastMessage = null
  receivedInitialState: Object = null

  private awaitingSocket = []
  private store = null
  private options: BridgeOptions
  private isSocketOpen = false
  private source = ''
  private initialState = {}
  private socket = null
  private afterInitialState: Promise<void> = null
  private finishInitialState: Function = null

  get state() {
    return this.store.state
  }

  // note: you have to call start to make it explicitly connect
  start = async (store, initialState, options: BridgeOptions = {}) => {
    if (!store) {
      throw new Error('No source given for starting screen store')
    }

    // create a promise we can resolve later
    this.afterInitialState = new Promise(res => {
      this.finishInitialState = res
    })

    this.port = getGlobalConfig().ports.bridge

    log.verbose(`Starting store ${this.source} on port ${this.port}`)

    // ensure only start once
    if (this.started) {
      throw new Error('Already started this store...')
    }

    this.source = store.source
    this.store = store
    this.options = options
    this.started = true

    if (options.master) {
      await this.setupMaster()
    } else {
      log.verbose(`Connecting socket to ${this.port}`)
      this.socket = new ReconnectingWebSocket(`ws://localhost:${this.port}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      })
      this.setupClientSocket()
    }

    // set initial state synchronously before
    this.initialState = JSON.parse(JSON.stringify(initialState))

    if (initialState) {
      this.setState(initialState, true)
    }

    // setup start/quit actions
    if (typeof window !== 'undefined' && window.addEventListener instanceof Function) {
      window.addEventListener('beforeunload', this.dispose)
    }

    log.verbose(`Waiting for initial state`)

    // wait for initial state
    if (!this.options.master && !this.options.waitForInitialState) {
      let failTm = setTimeout(() => {
        console.error('get initial state timeout!')
      }, 4000)
      await this.afterInitialState
      clearTimeout(failTm)
    }
  }

  private async setupMaster() {
    const stores = this.options.stores
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
    this.socket.onmessage = async ({ data }) => {
      if (!data) {
        log.info('No data received over socket')
        return
      }
      try {
        const msg = JSON.parse(data)

        if (msg.message) {
          this.handleMessage(msg)
          return
        }

        // receive the current state once we connect to master
        if (msg.initialState) {
          Mobx.transaction(() => {
            const state = msg.initialState
            // merge each key of state to keep the "deepness"
            // this.stores.App.state[key] = initialState.App[key]
            for (const name in state) {
              for (const key in state[name]) {
                this.stores[name].state[key] = state[name][key]
              }
            }
          })
          this.receivedInitialState = msg.initialState
          this.finishInitialState()
          return
        }

        // otherwise we are receiving a single state update

        // ignore self if we want that
        if (this.options.ignoreSelf && msg.source === this.source) {
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

    this.socket.onopen = () => {
      this.isSocketOpen = true

      this.getInitialState()

      if (this.awaitingSocket.length) {
        this.awaitingSocket.map(x => x())
        this.awaitingSocket = []
      }

      // send state that hasnt been synced yet
      this.scheduleSendState()
    }

    this.socket.onclose = () => {
      this.isSocketOpen = false
    }

    this.socket.onerror = err => {
      if (err.preventDefault) {
        err.preventDefault()
        err.stopPropagation()
      }
      if (err.code === 'ETIMEDOUT') {
        log.info('socket timeout')
        return
      }
      if (this.socket.readyState == 1) {
        log.info('swift ws error', err)
      } else {
        log.info('socket err', this.source, err.message, err.stack)
      }
    }
  }

  getInitialState = () => {
    // get initial state
    log.verbose('socket opened, requesting initial state...')
    this.socket.send(JSON.stringify({ action: 'getInitialState', source: this.source }))
  }

  onOpenSocket = () => {
    return new Promise(res => {
      this.awaitingSocket.push(res)
    })
  }

  // this will go up to api and back down to all screen stores
  // set is only allowed from the source its set as initially
  setState = (newState, ignoreSend?) => {
    if (!this.started) {
      log.info('Warning! Bridge not started, can only call setState on the app that starts it.')
      return
    }
    if (process.env.NODE_ENV === 'development') {
      if (!newState || typeof newState !== 'object') {
        throw new Error(`Bad state passed to ${this.source}.setState: ${newState}`)
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
    if (this.options.master) {
      this.socketManager.sendAll(this.source, changedState)
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
    const message = { state: queue[0], source: this.source }
    // multiple state messages could have come in so lets merge it
    if (queue.length > 1) {
      // apply the rest of the queued state to make one data object to send
      for (let i = 0; i < queue.length; i++) {
        diffDeep(message.state, queue[i], { merge: true })
      }
    }
    try {
      this.socket.send(JSON.stringify(message))
    } catch (err) {
      log.info('error sending!', err.message)
      log.info('message is', message)
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
            : this.initialState[key] !== 'undefined'
          if (!isValidKey) {
            console.error(
              `${this.source}.updateStateWithDiff: tried to set a key not in initialState
                - key: ${key}
                - typeof initial state key: ${typeof this.initialState[key]}
                - value:
                  ${stringifyObject(newState)}
                - initial state:
                  ${stringifyObject(this.initialState)}`,
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

  handleMessage = ({ message, value }) => {
    // orbit so we can time between other things in the app...
    log.verbose('Bridge.handleMessage', this.source, message, value)
    for (const { type, listener } of this.messageListeners) {
      if (!type) {
        listener(message, value)
      } else if (message === type) {
        listener(value)
      }
    }
  }

  onMessage = (a, b?): Disposer => {
    let listener = b || a
    let type = b ? a : null
    let subscription = { type, listener }
    this.messageListeners.add(subscription)
    // return disposable
    return () => {
      this.messageListeners.delete(subscription)
    }
  }

  sendMessage = async (Store: any, message: string, value?: string | Object) => {
    if (!this.started) {
      throw new Error('Not started, can only call sendMessage on the app that starts it.')
    }
    if (!Store || !message) {
      throw new Error(`no store || message ${Store} ${message} ${value}`)
    }
    if (typeof Store.source !== 'string') {
      throw new Error(`Bad store.source, store: ${Store}`)
    }

    this.lastMessage = { message: message, at: Date.now() }

    if (this.options.master) {
      this.socketManager.sendMessage({ to: Store.source, message, value })
    } else {
      if (!this.isSocketOpen) {
        log.info('\n\n\nWaiting for open socket....\n\n\n')
        await this.onOpenSocket()
        log.info('\n\nSocket opened!\n\n\n')
      }
      // this prevents blockages on sending
      // this would happen when sockets are on desktop side
      // and then any Store.setState call will hang...
      nextCycleCb(() => {
        this.socket.send(JSON.stringify({ message, value, to: Store.source }))
      })
    }
  }

  dispose = () => {
    if (this.options.master) {
      this.socketManager.dispose()
    } else {
      this.socket.close()
    }
  }
}

// singleton because
export const Bridge = new BridgeManager()
