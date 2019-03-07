import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, WebSocketClientTransport } from '@o/mediator'
import { NewFallbackServerPortCommand } from '@o/models'
import root from 'global'
import ReconnectingWebSocket from 'reconnecting-websocket'

const log = new Logger('command:new-fallback-server-port')

export const NewFallbackServerPortResolver = resolveCommand(NewFallbackServerPortCommand, () => {
  const port = (root.mediatorServer as MediatorServer).options.fallbackClient.options.transports
    .length
  log.info('registering new port', port)
  ;(root.mediatorServer as MediatorServer).options.fallbackClient.options.transports.push(
    new WebSocketClientTransport(
      'electron',
      new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    ),
  )
  return port
})
