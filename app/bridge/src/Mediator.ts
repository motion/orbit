import { getGlobalConfig } from '@o/config'
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

const isBrowser = typeof window !== 'undefined'

export const Mediator = isBrowser
  ? new MediatorClient({
      transports: [
        new WebSocketClientTransport(
          'app-client-' + randomString(5),
          new ReconnectingWebSocket(
            // TODO get this from actual getGlobalConfig()
            `ws://localhost:${getGlobalConfig().ports.desktopMediator}`,
            [],
            {
              WebSocket,
              minReconnectionDelay: 1,
            },
          ),
        ),
      ],
    })
  : undefined
