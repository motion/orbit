import { Logger } from '@mcro/logger'
import { MediatorServer, resolveCommand, WebSocketClientTransport } from '@mcro/mediator'
import { RegisterFallbackServerCommand } from '@mcro/models'
import root from 'global'
import ReconnectingWebSocket from 'reconnecting-websocket'

const log = new Logger('command:register-fallback-server')

export const RegisterFallbackServerResolver = resolveCommand(RegisterFallbackServerCommand, ({ port }) => {
  log.info('registering new port', port)
  ;(root.mediatorServer as MediatorServer).options.fallbackClient.options.transports.push(new WebSocketClientTransport(
    'electron',
    new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
      WebSocket,
      minReconnectionDelay: 1,
    }),
  ))
})
