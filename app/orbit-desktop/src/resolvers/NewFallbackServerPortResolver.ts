// import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand, WebSocketClientTransport } from '@o/mediator'
import { NewFallbackServerPortCommand } from '@o/models'
import root from 'global'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { getGlobalConfig } from '@o/kit'

// const log = new Logger('command:new-fallback-server-port')

let lastUsed = 0

export const NewFallbackServerPortResolver = resolveCommand(NewFallbackServerPortCommand, () => {
  const port = getGlobalConfig().ports.electronMediators[lastUsed]
  lastUsed++

  console.log('registering mediator fallback port', port)

  // mutate, bad for now but we'd need to refactor MediatorServer
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
