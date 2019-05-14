import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

const isBrowser = typeof window !== 'undefined'

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

export const command: MediatorClient['command'] = isBrowser
  ? Mediator.command.bind(Mediator)
  : undefined
export const observeMany: MediatorClient['observeMany'] = isBrowser
  ? Mediator.observeMany.bind(Mediator)
  : undefined
export const observeOne: MediatorClient['observeOne'] = isBrowser
  ? Mediator.observeOne.bind(Mediator)
  : undefined
export const observeCount: MediatorClient['observeCount'] = isBrowser
  ? Mediator.observeCount.bind(Mediator)
  : undefined
export const loadMany: MediatorClient['loadMany'] = isBrowser
  ? Mediator.loadMany.bind(Mediator)
  : undefined
export const loadOne: MediatorClient['loadOne'] = isBrowser
  ? Mediator.loadOne.bind(Mediator)
  : undefined
export const loadCount: MediatorClient['loadCount'] = isBrowser
  ? Mediator.loadCount.bind(Mediator)
  : undefined
export const save: MediatorClient['save'] = isBrowser ? Mediator.save.bind(Mediator) : undefined
export const remove: MediatorClient['remove'] = isBrowser
  ? Mediator.remove.bind(Mediator)
  : undefined

export * from './useModel'
