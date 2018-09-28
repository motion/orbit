import { getGlobalConfig } from '@mcro/config'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import { ClientTransport } from '@mcro/mediator'
import { randomString } from '@mcro/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

const name = randomString(5)
const transports: ClientTransport[] = []

if (process.env.IS_SYNCERS || (!process.env.IS_DESKTOP && !process.env.IS_SYNCERS)) {
  transports.push(new WebSocketClientTransport(name, new ReconnectingWebSocket(
    // todo: rename dbBridge to desktopMediator or something since its not only does work with db
    `ws://localhost:${getGlobalConfig().ports.dbBridge}`,
    [],
    { WebSocket },
  )))
}
if (process.env.IS_DESKTOP || (!process.env.IS_DESKTOP && !process.env.IS_SYNCERS)) {
  transports.push(new WebSocketClientTransport(name, new ReconnectingWebSocket(
    `ws://localhost:40001`, // todo: someone would like to extract it into config
    [],
    { WebSocket },
  )))
}

export const Mediator = new MediatorClient({ transports })
export const command: MediatorClient["command"] = Mediator.command.bind(Mediator)
export const observeMany: MediatorClient["observeMany"] = Mediator.observeMany.bind(Mediator)
export const observeOne: MediatorClient["observeOne"] = Mediator.observeOne.bind(Mediator)
export const observeCount: MediatorClient["observeCount"] = Mediator.observeCount.bind(Mediator)
export const observeManyAndCount: MediatorClient["observeManyAndCount"] = Mediator.observeManyAndCount.bind(
  Mediator,
)
export const loadMany: MediatorClient["loadMany"] = Mediator.loadMany.bind(Mediator)
export const loadManyAndCount: MediatorClient["loadManyAndCount"] = Mediator.loadManyAndCount.bind(Mediator)
export const loadOne: MediatorClient["loadOne"] = Mediator.loadOne.bind(Mediator)
export const save: MediatorClient["save"] = Mediator.save.bind(Mediator)
export const remove: MediatorClient["remove"] = Mediator.remove.bind(Mediator)
