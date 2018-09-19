import { getGlobalConfig } from '@mcro/config'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import ReconnectingWebSocket from 'reconnecting-websocket'

export const Mediator = new MediatorClient({
  transport: new WebSocketClientTransport((new ReconnectingWebSocket(
    `ws://localhost:${getGlobalConfig().ports.dbBridge}`,
    [],
    { WebSocket },
  )) as any),
})

export const observeMany: typeof Mediator.observeMany = Mediator.observeMany.bind(Mediator)
export const observeOne: typeof Mediator.observeOne = Mediator.observeOne.bind(Mediator)
export const observeCount: typeof Mediator.observeCount = Mediator.observeCount.bind(Mediator)
export const observeManyAndCount: typeof Mediator.observeManyAndCount = Mediator.observeManyAndCount.bind(
  Mediator,
)
export const loadMany: typeof Mediator.loadMany = Mediator.loadMany.bind(Mediator)
export const loadOne: typeof Mediator.loadOne = Mediator.loadOne.bind(Mediator)
export const save: typeof Mediator.save = Mediator.save.bind(Mediator)
export const remove: typeof Mediator.remove = Mediator.remove.bind(Mediator)
