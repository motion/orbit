import { Space } from './Space'

// app data

export type ListsAppDataListItem = {
  name: string
  pinned: boolean
  order: number
  bits: {
    id: number
    order: number
  }[]
}

export type ListsAppData = {
  lists: ListsAppDataListItem[]
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
}

export type SearchApp = BaseApp & { type: 'search'; data: SearchAppData }
export type PeopleApp = BaseApp & { type: 'people'; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics'; data: TopicsAppData }
export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }

// App

export type App = SearchApp | PeopleApp | TopicsApp | ListsApp
