import { getGlobalConfig } from '@o/config'
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

export const Mediator = new MediatorClient({
  transports: [
    new WebSocketClientTransport(
      'electron' + randomString(5),
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    ),
  ],
})
