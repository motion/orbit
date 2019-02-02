import { AppType } from './AppTypes'
import { ListsApp, ListsAppData } from './ListApp'
import { SearchApp, SearchAppData } from './SearchApp'
import { Space } from './Space'

export * from './ListApp'
export * from './SearchApp'

// app data

export type PeopleAppData = {}

export type TopicsAppData = {
  trending?: { name: string }[]
  terms?: { name: string }[]
  topics?: { name: string }[]
}

export type CustomAppData = any

// base

export interface BaseApp {
  target: 'app'
  id?: number
  space?: Space
  spaceId?: number
  name?: string
  type?: string
  pinned?: boolean
  colors?: string[]
}

export type AppData = {
  search: SearchAppData
  people: PeopleAppData
  topics: TopicsAppData
  lists: ListsAppData
  custom: CustomAppData
}

export type PeopleApp = BaseApp & { type: AppType.people; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: AppType.topics; data: TopicsAppData }
export type SourcesApp = BaseApp & { type: AppType.sources; data: any }
export type SettingsApp = BaseApp & { type: AppType.settings; data: any }
export type CustomApp = BaseApp & { type: AppType.custom; data: CustomAppData }

// App

export type AppByType<A extends AppType> = A extends AppType.search
  ? SearchApp
  : A extends AppType.people
  ? PeopleApp
  : A extends AppType.topics
  ? TopicsApp
  : A extends AppType.lists
  ? ListsApp
  : A extends AppType.sources
  ? SourcesApp
  : A extends AppType.settings
  ? SettingsApp
  : App

export type App =
  | SearchApp
  | PeopleApp
  | TopicsApp
  | ListsApp
  | SourcesApp
  | SettingsApp
  | CustomApp
