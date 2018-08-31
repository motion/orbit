import { Server as WebSocketServer } from 'ws'
import { ServerTransport, TransportRequest, TransportResponse } from '../index'

export class WebSocketServerTransport implements ServerTransport {
  private websocket: WebSocketServer
  private socket: any
  private onCallbacks: ((data: TransportRequest) => void)[] = []

  constructor(options: { port: number }) {
    this.websocket = new WebSocketServer({ port: options.port })
    this.websocket.on('connection', socket => {
      this.socket = socket
      this.onCallbacks.forEach(callback => this.onMessage(callback))
    })
  }

  onMessage(callback: (data: TransportRequest) => void) {
    this.onCallbacks.push(callback)
    if (this.socket)
      this.socket.on('message', str => callback(JSON.parse(str)))
  }

  send(data: TransportResponse) {
    this.socket.send(JSON.stringify(data))
  }

}