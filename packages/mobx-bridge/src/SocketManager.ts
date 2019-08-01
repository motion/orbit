import { Logger } from '@o/logger'
import { Server } from 'ws'

const log = new Logger('mobx-bridge SocketManager')

export class SocketManager {
  activeSockets = []
  onState: Function
  actions: { getInitialState?: Function; onMessage: Function }
  port: number
  server: Server
  masterSource: string

  constructor({ port, actions, onState, masterSource }) {
    this.onState = onState
    this.actions = actions
    this.port = port
    this.masterSource = masterSource
  }

  async start() {
    this.server = new Server({ port: this.port })
    this.setupSocket()
  }

  dispose() {
    this.server.clients.forEach(ws => {
      ws.close()
      ws.terminate()
    })
  }

  get hasListeners() {
    return !!this.activeSockets.length
  }

  sendInitialState = (socket, initialState: Object) => {
    try {
      socket.send(JSON.stringify({ initialState }))
    } catch (err) {
      log.info('error with scoket', err.message, err.stack)
    }
  }

  sendState = (socket, state: Object, source) => {
    if (!state) {
      throw new Error(`No state provided for SocketManager.send: ${state}`)
    }
    try {
      socket.send(JSON.stringify({ source, state }))
    } catch (err) {
      log.info('error with scoket', err.message, err.stack)
    }
  }

  // really fast direct messages
  sendMessage = (data: { to: string; message: string; value?: any }) => {
    for (const { uid, socket } of this.activeSockets) {
      if (this.identities[uid] !== data.to) {
        continue
      }
      socket.send(JSON.stringify(data))
    }
  }

  sendAll = (source: string, state: Object, { skipUID }: { skipUID?: number } = {}) => {
    if (!source) {
      throw new Error(`No source (${source}) provided to state message
        ${JSON.stringify(state, null, 2)}`)
    }
    if (!state) {
      throw new Error(`No state provided for SocketManager.sendAll: ${state}`)
    }
    const strData = JSON.stringify({ state, source })
    for (const { socket, uid } of this.activeSockets) {
      if (uid === skipUID) {
        continue
      }
      try {
        socket.send(strData)
      } catch (err) {
        log.info('API: failed to send to socket, removing', err.message, uid)
        this.removeSocket(uid)
      }
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => s.uid !== uid)
    delete this.identities[uid]
  }

  identities = {}

  decorateSocket = (uid, socket) => {
    // listen for incoming
    socket.on('message', str => {
      // message
      const { action, state, source, message, value, to } = JSON.parse(str)
      if (to) {
        if (to === this.masterSource) {
          console.log(str)
          this.actions.onMessage({ message, value })
          return
        }
        this.sendMessage({ to, message, value })
        return
      }
      if (state) {
        // console.log('should send', source || '---nostate:(', state)
        this.onState(source, state)
        this.sendAll(source, state, { skipUID: uid })
      }
      // initial message
      if (action === 'getInitialState') {
        this.identities[uid] = source
        log.verbose('got a getInitialState action, identities', this.identities)
      }
      if (this.actions[action]) {
        this.actions[action]({ source, socket })
      }
    })

    // handle events
    socket.on('close', () => {
      this.removeSocket(uid)
    })

    socket.on('error', err => {
      // ignore ECONNRESET throw anything else
      if (err.code !== 'ECONNRESET') {
        throw err
      }
      this.removeSocket(uid)
    })
  }

  setupSocket() {
    let id = 0
    this.server.on('connection', socket => {
      let uid = ++id
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      this.decorateSocket(uid, socket)
    })

    this.server.on('close', () => {
      log.info('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })

    this.server.on('error', (...args) => {
      log.info('wss error', args)
    })
  }
}
