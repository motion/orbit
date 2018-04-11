import { Server } from 'ws'
import debug from '@mcro/debug'

const log = debug('scrn')

export default class SocketManager {
  activeSockets = []
  onState: Function
  actions: { onMessage?: Function }
  port: number
  wss: Server

  constructor({ port, actions, onState }) {
    this.onState = onState
    this.actions = actions
    this.port = port
  }

  async start() {
    // await fastKill(this.port)
    this.wss = new Server({ port: this.port })
    this.setupSocket()
  }

  dispose() {
    this.wss.clients.forEach(ws => {
      ws.terminate()
    })
  }

  get hasListeners() {
    return !!this.activeSockets.length
  }

  send = (socket, state: Object, source) => {
    if (!state) {
      throw new Error(`No state provided for SocketManager.send: ${state}`)
    }
    try {
      socket.send(JSON.stringify({ source, state }))
    } catch (err) {
      log('error with scoket', err.message, err.stack)
    }
  }

  // really fast direct messages
  sendMessage = (source: string, message: string) => {
    console.log('sendmessage', source, message)
    for (const { uid, socket } of this.activeSockets) {
      if (this.identities[uid] !== source) {
        continue
      }
      socket.send(`-${message}`)
    }
  }

  sendAll = (
    source: string,
    state: Object,
    { skipUID }: { skipUID?: number } = {},
  ) => {
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
    delete this.identities[uid]
  }

  identities = {}

  decorateSocket = (uid, socket) => {
    // listen for incoming
    socket.on('message', str => {
      // message
      const { action, state, source, message, to } = JSON.parse(str)
      if (to) {
        this.sendMessage(to, message)
        return
      }
      if (state) {
        if (this.onState) {
          this.onState(source, state)
        }
        // console.log('should send', source || '---nostate:(', state)
        this.sendAll(source, state, { skipUID: uid })
      }
      // initial message
      if (action === 'getState') {
        this.identities[uid] = source
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
    // log connections
    let lastCount = 0
    setInterval(() => {
      const count = this.activeSockets.length
      if (lastCount != count) log(count, 'connections')
      lastCount = count
    }, 5000)
    this.wss.on('connection', socket => {
      let uid = id++
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
