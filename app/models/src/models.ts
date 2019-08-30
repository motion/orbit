import { Model } from '@o/mediator'
import { FindOptions, FindOptionsWhere } from 'typeorm'

import { AppBit } from './AppBit'
import { AppDefinition } from './AppInterfaces'
import { Bit } from './Bit'
import { BitContentType } from './BitContentType'
import { Job } from './Job'
import { OracleWordsFound } from './OracleInterfaces'
import { Setting } from './Setting'
import { Space } from './SpaceInterface'
import { State } from './State'
import { User } from './User'

export const BitModel = new Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>('Bit')
export const JobModel = new Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>('Job')
export const SpaceModel = new Model<Space, FindOptions<Space>, FindOptionsWhere<Space>>('Space')
export const AppModel = new Model<AppBit, FindOptions<AppBit>, FindOptionsWhere<AppBit>>('App')
export const UserModel = new Model<User, FindOptions<User>, FindOptionsWhere<User>>('User')
export const StateModel = new Model<State, FindOptions<State>, FindOptionsWhere<State>>('State')
export const SettingModel = new Model<Setting, FindOptions<Setting>, FindOptionsWhere<Setting>>(
  'Setting',
)

export type BuildInfo = {
  hash: string
  filesHash: {
    [path: string]: string
  }
}

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
 * For current build status of apps
 */
export type BuildStatus = {
  // id per-message to determine if it changes
  scriptName: string
  identifier: string
  entryPathRelative: string
  status: 'complete' | 'building' | 'error'
  mode: 'production' | 'development'
  env: 'node' | 'client'
  message?: string
}
export const BuildStatusModel = new Model<BuildStatus, { identifier?: string }>('BuildStatusModel')

/**
 * For communicating directly to a specific window: note we should rename this to `WindowBannerModel` or similar
 * and appId should become windowId, what it really is
 */
export type WindowMessage = {
  // id per-message to determine if it changes
  id: string
  windowId?: number
  type: 'error' | 'warn' | 'success' | 'info'
  message: string
  title?: string
  timeout?: number
  loading?: boolean
}
export const WindowMessageModel = new Model<WindowMessage, { windowId: number }>(
  'WindowMessageModel',
)

/**
 * For communicating the status of the current workspace, for reloading app definitions
 * across processes (see orbit-workers using this).
 */
export type WorkspaceInfo = {
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

export const OrbitProcessStdOutModel = new Model<string, undefined>('OrbitProcessStdOutModel')

export const OracleWordsFoundModel = new Model<OracleWordsFound, undefined>('OracleWordsFoundModel')
