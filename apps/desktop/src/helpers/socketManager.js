// @flow
import killPort from 'kill-port'
import { Server } from 'ws'

const log = debug('scrn')

export default class SocketManager {
  activeSockets = []

  constructor({ port, source }) {
    this.source = source
    this.port = port
  }

  async start() {
    await killPort(this.port)
    this.wss = new Server({ port: this.port })
    this.setupSocket()
  }

  get hasListeners() {
    return !!this.activeSockets.length
  }

  send = (socket, state: Object) => {
    if (!state) {
      throw new Error(`No state provided for SocketManager.send: ${state}`)
    }
    try {
      socket.send(JSON.stringify({ source: this.source, state }))
    } catch (err) {
      log('error with scoket', err.message, err.stack)
    }
  }

  sendAll = (source: string, state: Object, { skipUID } = {}) => {
    if (!source) {
      throw new Error(`No source (${source}) provided to state message
        ${JSON.stringify(state, 0, 2)}`)
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
        log('API: failed to send to socket, removing', err.message, uid)
        this.removeSocket(uid)
      }
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => s.uid !== uid)
  }

  decorateSocket = (uid, socket) => {
    // listen for incoming
    socket.on('message', str => {
      const { action, value, state, source } = JSON.parse(str)
      if (state) {
        // console.log('should send', source || '---nostate:(', state)
        this.sendAll(source, state, { skipUID: uid })
      }
      if (action && this[action]) {
        log('received action:', action)
        this[action].call(this, value)
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
    // log connections
    let lastCount = 0
    setInterval(() => {
      const count = this.activeSockets.length
      if (lastCount != count) log(count, 'connections')
      lastCount = count
    }, 5000)
    this.wss.on('connection', socket => {
      let uid = id++
      if (this.onConnection) {
        this.onConnection(socket)
      }
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      this.decorateSocket(uid, socket)
    })
    this.wss.on('close', () => {
      log('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })
    this.wss.on('error', (...args) => {
      log('wss error', args)
    })
  }
}
