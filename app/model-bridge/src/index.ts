import { Bit, Job, Person, PersonBit, Setting } from '@mcro/models'
import { MediatorClient, WebSocketClientTransport } from '@mcro/mediator'
import { WebSocketProvider } from './WebSocketProvider'
import { Repository } from './Repository'
import { getGlobalConfig } from '@mcro/config'
import ReconnectingWebSocket from 'reconnecting-websocket'

// use repositories from outside desktop

export const provider = new WebSocketProvider()

export const SearchIndexRepository = new Repository<Bit>('SearchIndex', provider)
export const BitRepository = new Repository<Bit>('BitEntity', provider)
export const PersonRepository = new Repository<Person>('PersonEntity', provider)
export const JobRepository = new Repository<Job>('JobEntity', provider)
export const PersonBitRepository = new Repository<PersonBit>('PersonBitEntity', provider)
export const SettingRepository = new Repository<Setting>('SettingEntity', provider)

export const websocket = new ReconnectingWebSocket(
  `ws://localhost:${getGlobalConfig().ports.dbBridge}`,
  [],
  { WebSocket },
)

export const Mediator = new MediatorClient({
  transport: new WebSocketClientTransport(websocket as any),
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
