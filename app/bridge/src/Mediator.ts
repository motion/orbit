import { getGlobalConfig } from '@o/config'
import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { randomString } from '@o/utils'
import ReconnectingWebSocket from 'reconnecting-websocket'

const runMediator = process.env.RUN_MEDIATOR === 'true' || typeof window !== 'undefined'
const Config = getGlobalConfig()

export const Mediator =
  runMediator && Config
    ? new MediatorClient({
        transports: [
          new WebSocketClientTransport(
            'app-client-' + randomString(5),
            new ReconnectingWebSocket(
              // TODO get this from actual getGlobalConfig()
              `ws://localhost:${Config.ports.desktopMediator}`,
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

const hasCommands = !!Mediator

export const command: MediatorClient['command'] = hasCommands
  ? Mediator.command.bind(Mediator)
  : undefined

export const observeMany: MediatorClient['observeMany'] = hasCommands
  ? Mediator.observeMany.bind(Mediator)
  : undefined

export const observeOne: MediatorClient['observeOne'] = hasCommands
  ? Mediator.observeOne.bind(Mediator)
  : undefined

export const observeCount: MediatorClient['observeCount'] = hasCommands
  ? Mediator.observeCount.bind(Mediator)
  : undefined

export const loadMany: MediatorClient['loadMany'] = hasCommands
  ? Mediator.loadMany.bind(Mediator)
  : undefined

export const loadOne: MediatorClient['loadOne'] = hasCommands
  ? Mediator.loadOne.bind(Mediator)
  : undefined

export const loadCount: MediatorClient['loadCount'] = hasCommands
  ? Mediator.loadCount.bind(Mediator)
  : undefined

export const save: MediatorClient['save'] = hasCommands ? Mediator.save.bind(Mediator) : undefined

export const remove: MediatorClient['remove'] = hasCommands
  ? Mediator.remove.bind(Mediator)
  : undefined
