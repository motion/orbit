import { Server as WebSocketServer } from 'ws'
import { ServerTransportInterface } from '../index'

export class WebSocketServerTransport implements ServerTransportInterface {
  private websocket: WebSocketServer
  private socket: any
  private onCallbacks: ((data: any) => any)[] = []

  constructor(options: { port: number }) {
    this.websocket = new WebSocketServer({ port: options.port })
    this.websocket.on('connection', socket => {
      this.socket = socket
      this.onCallbacks.forEach(callback => this.onMessage(callback))
    })
  }

  onMessage(callback: (data: any) => any) {
    this.onCallbacks.push(callback)
    if (this.socket)
      this.socket.on('message', str => callback(JSON.parse(str)))
  }

  send(data: any) {
    this.socket.send(JSON.stringify(data))
  }

}