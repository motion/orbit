import { Model } from '@mcro/mediator'
import { FindOptions, FindOptionsWhere } from 'typeorm'
import { AppBit } from './interfaces/AppBit'
import { Bit } from './interfaces/Bit'
import { BitContentType } from './interfaces/BitContentType'
import { Job } from './interfaces/Job'
import { SearchResult } from './interfaces/Search'
import { Setting } from './interfaces/Setting'
import { Source } from './interfaces/Source'
import { SourceType } from './interfaces/SourceType'
import { Space } from './interfaces/Space'
import { User } from './interfaces/User'

export const BitModel = new Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>('Bit')

export const JobModel = new Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>('Job')

export const SettingModel = new Model<Setting, FindOptions<Setting>, FindOptionsWhere<Setting>>(
  'Setting',
)

export const SpaceModel = new Model<Space, FindOptions<Space>, FindOptionsWhere<Space>>('Space')

export const AppModel = new Model<AppBit, FindOptions<AppBit>, FindOptionsWhere<AppBit>>('App')

export const SourceModel = new Model<Source, FindOptions<Source>, FindOptionsWhere<Source>>(
  'Source',
)

export const UserModel = new Model<User, FindOptions<User>, FindOptionsWhere<User>>('User')

export const GithubRepositoryModel = new Model<any, { sourceId: number }>('GithubRepository')

export const SlackChannelModel = new Model<any, { sourceId: number }>('SlackChannel')

export const SearchPinnedResultModel = new Model<Bit, { query: string }>(
  'SearchPinnedResultModel',
)

export type SearchQuery = {
  query: string
  sortBy?: 'Recent' | 'Relevant'
  searchBy?: 'Topic' | 'Bit'
  startDate?: Date
  endDate?: Date
  sourceFilters?: SourceType[]
  peopleFilters?: string[]
  locationFilters?: string[]
  take: number
  skip?: number
  sourceId?: number
  sourceIds?: number[]
  group?: string
  maxBitsCount?: number
  spaceId?: number
  ids?: number[]
  contentType?: BitContentType
}

export const SearchResultModel = new Model<SearchResult, SearchQuery>('SearchResult')

export type GroupResult = {
  title: string
  locations: string[]
  Sources: string[]
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

export type SalientWord = {
  word: string
  uniqueness: number
}

export const CosalTopWordsModel = new Model<string, { text: string; max?: number }>(
  'cosal-top-words-model',
)

export const CosalSaliencyModel = new Model<SalientWord, { words: string }>('cosal-saliency-model')

export const CosalTopicsModel = new Model<string, { query: string; count: number }>(
  'cosal-topics-model',
)

// Language app

export type TrendingItem = { name: string; direction: 'up' | 'neutral' | 'down' }
export const TrendingTopicsModel = new Model<TrendingItem, void>('trending-topics')
export const TrendingTermsModel = new Model<TrendingItem, void>('trending-terms')

export const PeopleNearTopicModel = new Model<Bit, { topic: string; count: number }>(
  'people-near-topic',
)
export const BitsNearTopicModel = new Model<Bit, { topic: string; count: number }>(
  'bits-near-topic',
)
