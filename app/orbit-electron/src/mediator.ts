import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import { getGlobalConfig } from '@mcro/config'
import { randomString } from '@mcro/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

export const Mediator = new MediatorClient({
  transports: [
    new WebSocketClientTransport(
      'electron' + randomString(5),
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )
  ]
})