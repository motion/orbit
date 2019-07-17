import { randomString } from '@o/utils'
import { Server as WebSocketServer } from 'ws'

import { ServerTransport, TransportRequest, TransportResponse } from '..'
import { log } from '../common/logger'

export class WebSocketServerTransport implements ServerTransport {
  private websocket: WebSocketServer
  private clients: {
    id: string
    client: any
    // lastPong: number
  }[] = []
  private onCallbacks: ((data: TransportRequest) => void)[] = []

  constructor(options: { port: number }) {
    this.websocket = new WebSocketServer({ port: options.port })
    this.websocket.on('connection', client => {
      log.verbose('client connected')

      const storedClient = { id: '', client /*, lastPong: Date.now()*/ }
      this.clients.push(storedClient)

      // const pongInterval = setInterval(() => {
      //   if (Date.now() - storedClient.lastPong > 3000) {
      //     log.verbose('client disconnected (no pong), removing client from the list of registered clients', storedClient);
      //     clearInterval(pongInterval);
      //     client.close();
      //     this.clients.splice(this.clients.indexOf(storedClient), 1)
      //   }
      // }, 3000);

      client.on('message', (str: any) => {
        // special code returned by pong sent by client
        // if (str === "PONG") {
        //   storedClient.lastPong = Date.now();
        //   return
        // }
        const result: TransportRequest = JSON.parse(str)

        // update client id if its a first request it it haven't been set yet
        if (!storedClient.id && result.id) {
          ;[storedClient.id] = result.id.split('_')
        }

        this.onCallbacks.forEach(callback => callback(result))
      })
    })

    // theoretically this should'nt ever happen
    this.websocket.on('close', client => {
      log.verbose('client disconnected', client)
      const registeredClient = this.clients.indexOf(client)
      if (registeredClient !== -1) {
        this.clients.splice(registeredClient, 1)
      }
    })
  }

  onMessage(callback: (data: TransportRequest) => void) {
    this.onCallbacks.push(callback)
  }

  send(data: TransportResponse) {
    const [clientId] = data.id.split('_')
    const client = this.clients.find(client => {
      return client.id === clientId && client.client.readyState === client.client.OPEN
    })
    if (client) {
      const sendIdentifier = randomString(5)
      data = { ...data, sendIdentifier }
      log.verbose(
        `send to "${clientId}"`,
        sendIdentifier,
        process.env.DEBUG_QUERIES ? data : `DEBUG_QUERIES=true to debug`,
      )
      client.client.send(JSON.stringify(data))
    }
  }
}
