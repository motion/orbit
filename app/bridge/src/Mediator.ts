import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { isBrowser } from './commands'

export const Mediator = isBrowser
  ? new MediatorClient({
      transports: [
        new WebSocketClientTransport(
          'app-client-' + randomString(5),
          new ReconnectingWebSocket(
            // TODO get this from actual getGlobalConfig()
            `ws://localhost:${window['GlobalConfig'].ports.desktopMediator}`,
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
