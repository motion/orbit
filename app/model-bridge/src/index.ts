import { getGlobalConfig } from '@mcro/config'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import { ClientTransport } from '@mcro/mediator'
import { randomString } from '@mcro/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

const transports: ClientTransport[] = []

// want this to be a single name for this client (no matter how many transports)
const name = randomString(5)
const isWebApp = !process.env.SUB_PROCESS
const shouldConnectToSyncers = process.env.SUB_PROCESS === 'desktop' || isWebApp
const shouldConnectToDesktop = process.env.SUB_PROCESS === 'syncers' || isWebApp

if (shouldConnectToSyncers) {
  transports.push(
    new WebSocketClientTransport(
      name,
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.syncersMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    ),
  )
}

if (shouldConnectToDesktop) {
  transports.push(
    new WebSocketClientTransport(
      name,
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    ),
  )
}

export const Mediator = new MediatorClient({ transports })
export const command: MediatorClient['command'] = Mediator.command.bind(Mediator)
export const observeMany: MediatorClient['observeMany'] = Mediator.observeMany.bind(Mediator)
export const observeOne: MediatorClient['observeOne'] = Mediator.observeOne.bind(Mediator)
export const observeCount: MediatorClient['observeCount'] = Mediator.observeCount.bind(Mediator)
export const observeManyAndCount: MediatorClient['observeManyAndCount'] = Mediator.observeManyAndCount.bind(
  Mediator,
)
export const loadMany: MediatorClient['loadMany'] = Mediator.loadMany.bind(Mediator)
export const loadManyAndCount: MediatorClient['loadManyAndCount'] = Mediator.loadManyAndCount.bind(
  Mediator,
)
export const loadOne: MediatorClient['loadOne'] = Mediator.loadOne.bind(Mediator)
export const save: MediatorClient['save'] = Mediator.save.bind(Mediator)
export const remove: MediatorClient['remove'] = Mediator.remove.bind(Mediator)

export * from './useModel'
