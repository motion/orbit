import { Bit, Job, Person, PersonBit, Setting } from '@mcro/models'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import { WebSocketProvider } from '../helpers/repository/WebSocketProvider'
import { Repository } from '../helpers/repository/Repository'
import { getGlobalConfig } from '@mcro/config'
import ReconnectingWebSocket from 'reconnecting-websocket'

const provider = new WebSocketProvider()

export const BitRepository = new Repository<Bit>('BitEntity', provider)
export const PersonRepository = new Repository<Person>('PersonEntity', provider)
export const JobRepository = new Repository<Job>('JobEntity', provider)
export const PersonBitRepository = new Repository<PersonBit>(
  'PersonBitEntity',
  provider,
)
export const SettingRepository = new Repository<Setting>(
  'SettingEntity',
  provider,
)

const websocket = new ReconnectingWebSocket(
  `ws://localhost:${getGlobalConfig().ports.dbBridge}`,
  [],
  {
    WebSocket,
  },
)

export const Mediator = new MediatorClient({
  transport: new WebSocketClientTransport(websocket as any),
})

export const observeMany = Mediator.observeMany.bind(Mediator)
export const observeOne = Mediator.observeOne.bind(Mediator)
export const observeCount = Mediator.observeCount.bind(Mediator)
export const observeManyAndCount = Mediator.observeManyAndCount.bind(Mediator)
