import { Model } from '@o/mediator'
import { FindOptions, FindOptionsWhere } from 'typeorm'

import { AppBit } from './interfaces/AppBit'
import { Bit } from './interfaces/Bit'
import { BitContentType } from './interfaces/BitContentType'
import { Job } from './interfaces/Job'
import { Space } from './interfaces/SpaceInterface'
import { State } from './interfaces/State'
import { User } from './interfaces/User'
import { AppDefinition } from './AppDefinition'

export const BitModel = new Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>('Bit')

export const JobModel = new Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>('Job')

export const SpaceModel = new Model<Space, FindOptions<Space>, FindOptionsWhere<Space>>('Space')

export const AppModel = new Model<AppBit, FindOptions<AppBit>, FindOptionsWhere<AppBit>>('App')

export const UserModel = new Model<User, FindOptions<User>, FindOptionsWhere<User>>('User')

export const StateModel = new Model<State, FindOptions<State>, FindOptionsWhere<State>>('State')

export type SearchQuery = {
  query: string
  contentType?: BitContentType
  sortBy?: 'Recent' | 'Relevant'
  startDate?: Date | null
  endDate?: Date | null
  appFilters?: string[]
  peopleFilters?: string[]
  locationFilters?: string[]
  take: number
  skip?: number
  appId?: number
  appIds?: number[]
  spaceId?: number
  ids?: number[]
}

export const SearchResultModel = new Model<Bit, SearchQuery>('SearchResult')

/**
 * For communicating things like: build status, startup status, upgrading, etc
 * Allows for observeOne() which should give us a streaming bus of status messages
 */
export type AppStatusMessage = {
  // id per-message to determine if it changes
  id: string
  type: 'error' | 'warn' | 'success' | 'info'
  message: string
  appId?: number
}

export const AppStatusModel = new Model<AppStatusMessage, { appId: number }>('AppStatusModel')
export const AppStatusId = {
  install: (identifier: string) => `install-${identifier}`,
}

/**
 * For communicating the status of the current workspace, for reloading app definitions
 * across processes (see orbit-workers using this).
 */
type WorkspaceInfo = {
  identifier: string
  definitions: AppDefinition & { version?: number }
}
export const WorkspaceInfoModel = new Model<WorkspaceInfo, undefined>('WorkspaceInfoModel')

export type GroupResult = {
  title: string
  locations: string[]
  Apps: string[]
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
