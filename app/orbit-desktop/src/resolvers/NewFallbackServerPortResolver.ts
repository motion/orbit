// import { Logger } from '@o/logger'
import { getGlobalConfig } from '@o/config'
import { MediatorServer, resolveCommand, WebSocketClientTransport } from '@o/mediator'
import { NewFallbackServerPortCommand } from '@o/models'
import root from 'global'
import ReconnectingWebSocket from 'reconnecting-websocket'

// const log = new Logger('command:new-fallback-server-port')

let lastUsed = 0

export const NewFallbackServerPortResolver = resolveCommand(NewFallbackServerPortCommand, () => {
  const port = getGlobalConfig().ports.electronMediators[lastUsed]
  lastUsed++

  const server = root.mediatorServer as MediatorServer

  // mutate, bad for now but we'd need to refactor MediatorServer
  server.options.fallbackClient.options.transports.push(
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
