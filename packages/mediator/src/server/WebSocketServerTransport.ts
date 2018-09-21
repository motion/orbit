import { Server as WebSocketServer } from 'ws'
import { log } from '../common/logger'
import { ServerTransport, TransportRequest, TransportResponse } from '../index'

export class WebSocketServerTransport implements ServerTransport {
  private websocket: WebSocketServer
  private clients: any[] = []
  private onCallbacks: ((data: TransportRequest) => void)[] = []

  constructor(options: { port: number }) {
    this.websocket = new WebSocketServer({ port: options.port })
    this.websocket.on('connection', client => {
      log.verbose('client connected')
      this.clients.push(client)
      this.onCallbacks.forEach(callback => this.onMessage(callback))
    })
    this.websocket.on('disconnect', client => {
      log.verbose('client disconnected', client)
      const registeredClient = this.clients.indexOf(client)
      if (registeredClient !== -1) {
        this.clients.splice(registeredClient, 1)
      }
    })
  }

  onMessage(callback: (data: TransportRequest) => void) {
    this.onCallbacks.push(callback)
    for (let client of this.clients) {
      client.on('message', str => {
        const result = JSON.parse(str)
        log.verbose('received message from the client', result)
        return callback(result)
      })
    }
  }

  send(data: TransportResponse) {
    log.verbose('sending data to the client', data)
    for (let client of this.clients) {
      client.send(JSON.stringify(data))
    }
  }
}
