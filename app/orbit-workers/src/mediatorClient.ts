import { getGlobalConfig } from '@o/config'
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import ReconnectingWebSocket from 'reconnectingwebsocket'

export const mediatorClient = new MediatorClient({
  transports: [
    new WebSocketClientTransport(
      'workers', // randomString(5)
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
        // @ts-ignore
        WebSocket,
        minReconnectionDelay: 1,
      }),
    ),
  ],
})
