import { Space } from './Space'

// app data

type ItemID = number | string

export type ListAppDataItem =
  | {
      id: ItemID
      type: 'folder' | 'root'
      name?: string
      children: ItemID[]
      icon?: string
    }
  | {
      id: ItemID
      type: 'bit' | 'person'
      name?: string
      icon?: string
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

interface BaseApp {
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

export type AppByType = {
  search: SearchApp
  people: PeopleApp
  topics: TopicsApp
  lists: ListsApp
  memory: MemoryApp
  sources: SourcesApp
  settings: SettingsApp
}

export type App =
  | SearchApp
  | PeopleApp
  | TopicsApp
  | ListsApp
  | MemoryApp
  | SourcesApp
  | SettingsApp
