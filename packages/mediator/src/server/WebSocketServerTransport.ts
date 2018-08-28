import { Server as WebSocketServer } from 'ws'
import { ServerTransportInterface } from '../index'

export class WebSocketServerTransport implements ServerTransportInterface {
  private websocket: WebSocketServer
  private socket: any
  private awaitingCallbacks: ((data: any) => any)[] = []

  constructor(options: { port: number }) {
    this.websocket = new WebSocketServer({ port: options.port })
    this.websocket.on('connection', socket => {
      this.socket = socket
      this.awaitingCallbacks.forEach(callback => this.onMessage(callback))
      this.awaitingCallbacks = []
    })
  }

  onMessage(callback: (data: any) => any) {
    if (this.socket) {
      this.socket.on('message', str => callback(JSON.parse(str)))
    } else {
      this.awaitingCallbacks.push(callback)
    }
  }

  send(data: any) {
    this.socket.send(JSON.stringify(data))
  }

}