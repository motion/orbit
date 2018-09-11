import { getServer } from './getServer'
import { Server } from 'ws'

type Props = {
  port: number
  getActions: () => Object
  setState: Function
  getState: Function
  onWindowChangeCB: Function
}

export type SocketSender = (action: string, data?: Object) => void

type BridgeHandlers = {
  socketSend: SocketSender
}

export class OracleBridge {
  props: Props
  server: Server
  port: number
  awaitingSocket = []
  socket = null

  constructor(props: Props) {
    this.props = props
    this.port = this.props.port
  }

  start = async (cb: ((handlers: BridgeHandlers) => void)) => {
    this.server = await getServer(this.port)
    this.setupSocket()
    cb({
      socketSend: this.socketSend,
    })
  }

  onConnected() {
    return new Promise(res => {
      // wait for connection to socket before sending start
      let startWait = setInterval(() => {
        if (this.socket) {
          clearInterval(startWait)
          res()
        }
      }, 50)
    })
  }

  stop = async () => {
    this.server.close()
  }

  socketSend = async (action, data?) => {
    if (!this.socket) {
      this.awaitingSocket.push({ action, data })
      return
    }
    // send format is `action data`
    try {
      const strData =
        typeof data === 'object' ? `${action} ${JSON.stringify(data)}` : action
      try {
        this.socket.send(strData)
      } catch (err) {
        if (err.message.indexOf('CLOSED')) {
          console.log('closed...')
        } else {
          console.log('oracle.socketSend Err', err.stack)
        }
      }
    } catch (err) {
      console.log('screen error parsing socket message', err.message)
    }
    // for now just simulate this async thing actually awaiting receive
    await new Promise(res => setTimeout(res))
  }

  private setupSocket() {
    this.server.once('connection', socket => {
      this.socket = socket
      // send initial state
      this.props.setState(this.props.getState())
      // send queued messages
      if (this.awaitingSocket.length) {
        this.awaitingSocket.forEach(({ action, data }) =>
          this.socketSend(action, data),
        )
        this.awaitingSocket = []
      }
      const actions = this.props.getActions()
      socket.on('message', str => {
        try {
          const { action, value, state } = JSON.parse(str.toString())
          if (state) {
            this.props.setState(state)
          }
          if (actions[action]) {
            actions[action](value)
          } else {
            // otherwise its a window change event
            if (!action) {
              return
            }
            this.props.onWindowChangeCB(action, value)
          }
        } catch (err) {
          console.log('Error receiving message', str)
          console.log(err.stack)
        }
      })
      // handle events
      socket.on('close', () => {
        console.log('removed1...')
      })
      socket.onerror = err => {
        if (err.message.indexOf('ECONNRESET')) return
        console.log('socket.onerror', err)
      }
      socket.on('error', err => {
        if (err['code'] !== 'ECONNRESET') {
          throw err
        }
        console.log('removed2...')
      })
    })
  }
}
