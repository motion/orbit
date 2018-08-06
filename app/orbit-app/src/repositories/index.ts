import { Bit, Job, Person, PersonBit, Setting } from '@mcro/models'
import { WebSocketProvider } from '../helpers/repository/WebSocketProvider'
import { Repository } from '../helpers/repository/Repository'

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
