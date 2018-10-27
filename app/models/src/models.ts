import { Model } from '@mcro/mediator'
import { FindOptions, FindOptionsWhere } from 'typeorm'
import { Bit } from './Bit'
import { Job } from './Job'
import { Person } from './Person'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'
// import { GithubRepository, SlackChannel } from '@mcro/services'

export const BitModel = new Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>('Bit')

export const JobModel = new Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>('Job')

export const PersonBitModel = new Model<
  PersonBit,
  FindOptions<PersonBit>,
  FindOptionsWhere<PersonBit>
>('PersonBit')

export const PersonModel = new Model<Person, FindOptions<Person>, FindOptionsWhere<Person>>(
  'Person',
)

export const SettingModel = new Model<Setting, FindOptions<Setting>, FindOptionsWhere<Setting>>(
  'Setting',
)

export const GithubRepositoryModel = new Model<any, { settingId: number }>('GithubRepository')

export const SlackChannelModel = new Model<any, { settingId: number }>('SlackChannel')

export const SearchPinnedResultModel = new Model<Bit | PersonBit, { query: string }>(
  'SearchPinnedResultModel',
)

export type SearchQuery = {
  query: string
  sortBy?: 'Recent' | 'Relevant'
  searchBy?: 'Topic' | 'Bit'
  startDate?: Date
  endDate?: Date
  integrationFilters?: string[]
  peopleFilters?: string[]
  locationFilters?: string[]
  take: number
  skip?: number
}

export const SearchResultModel = new Model<Bit, SearchQuery>('SearchResult')

export type GroupResult = {
  title: string
  locations: string[]
  integrations: string[]
  topics: string[]
  count: number
  people: { id: number; icon: string; name: string }
}

export const SalientWordsModel = new Model<string, { query: SearchQuery; count: number }>(
  'SalientWords',
)

export const SearchLocationsModel = new Model<string, { query: SearchQuery; count: number }>(
  'SearchLocationsModel',
)

export const SearchByTopicModel = new Model<Bit, { query: string; count: number }>('SearchByTopic')
