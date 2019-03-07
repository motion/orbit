import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

export const Mediator = new MediatorClient({
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

export const command: MediatorClient['command'] = Mediator.command.bind(Mediator)
export const observeMany: MediatorClient['observeMany'] = Mediator.observeMany.bind(Mediator)
export const observeOne: MediatorClient['observeOne'] = Mediator.observeOne.bind(Mediator)
export const observeCount: MediatorClient['observeCount'] = Mediator.observeCount.bind(Mediator)
export const loadMany: MediatorClient['loadMany'] = Mediator.loadMany.bind(Mediator)
export const loadOne: MediatorClient['loadOne'] = Mediator.loadOne.bind(Mediator)
export const loadCount: MediatorClient['loadCount'] = Mediator.loadCount.bind(Mediator)
export const save: MediatorClient['save'] = Mediator.save.bind(Mediator)
export const remove: MediatorClient['remove'] = Mediator.remove.bind(Mediator)

export * from './useModel'
