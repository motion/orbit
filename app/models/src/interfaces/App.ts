import { Space } from './Space'

// app data

type ItemID = number | string

export type ListAppDataItem = {
  id: ItemID
  type: 'bit' | 'person' | 'folder' | 'root'
  name?: string
  children: ItemID[]
}

export type ListsAppData = {
  rootItemID: ItemID
  items: { [key in ItemID]: ListAppDataItem }
}

export type PeopleAppData = {}

export type SearchAppData = {}

export type TopicsAppData = {
  trending?: { name: string }[]
  terms?: { name: string }[]
  topics?: { name: string }[]
}

// base

export interface BaseApp {
  target: 'app'
  id?: number
  space?: Space
  spaceId?: number
  name?: string
  type?: string
  data?: any
}

export type AppData = {
  search: SearchAppData
  people: PeopleAppData
  topics: TopicsAppData
  lists: ListsAppData
  memory: {}
}

export type SearchApp = BaseApp & { type: 'search'; data: SearchAppData }
export type PeopleApp = BaseApp & { type: 'people'; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics'; data: TopicsAppData }
export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }
export type MemoryApp = BaseApp & { type: 'memory'; data: any }
export type SourcesApp = BaseApp & { type: 'sources'; data: any }
export type SettingsApp = BaseApp & { type: 'settings'; data: any }

// App

export type App =
  | SearchApp
  | PeopleApp
  | TopicsApp
  | ListsApp
  | MemoryApp
  | SourcesApp
  | SettingsApp
