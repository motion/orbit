import { getGlobalConfig } from '@mcro/config'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import ReconnectingWebSocket from 'reconnecting-websocket'
// import { randomString } from '@mcro/utils'

export const Mediator = new MediatorClient({
  transports: [
    new WebSocketClientTransport(
      'app-client', // randomString(5)
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )
  ]
})

export const command: MediatorClient['command'] = Mediator.command.bind(Mediator)
export const observeMany: MediatorClient['observeMany'] = Mediator.observeMany.bind(Mediator)
export const observeOne: MediatorClient['observeOne'] = Mediator.observeOne.bind(Mediator)
export const observeCount: MediatorClient['observeCount'] = Mediator.observeCount.bind(Mediator)
export const loadMany: MediatorClient['loadMany'] = Mediator.loadMany.bind(Mediator)
export const loadOne: MediatorClient['loadOne'] = Mediator.loadOne.bind(Mediator)
export const loadCount: MediatorClient['loadCount'] = Mediator.loadCount.bind(Mediator)
export const save: MediatorClient['save'] = Mediator.save.bind(Mediator)
export const remove: MediatorClient['remove'] = Mediator.remove.bind(Mediator)
