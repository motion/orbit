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

export type PeopleApp = BaseApp & { type: 'people'; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics'; data: TopicsAppData }
export type SourcesApp = BaseApp & { type: 'sources'; data: any }
export type SettingsApp = BaseApp & { type: 'settings'; data: any }
export type CustomApp = BaseApp & { type: 'custom'; data: CustomAppData }

// App

export type AppByType = {
  search: SearchApp
  people: PeopleApp
  topics: TopicsApp
  lists: ListsApp
  sources: SourcesApp
  settings: SettingsApp
}

export type App = SearchApp | PeopleApp | TopicsApp | ListsApp | SourcesApp | SettingsApp
