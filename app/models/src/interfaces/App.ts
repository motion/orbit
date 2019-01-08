import { ListsAppData } from '../app-data/ListsAppData'
import { PeopleAppData } from '../app-data/PeopleAppData'
import { SearchAppData } from '../app-data/SearchAppData'
import { TopicsAppData } from '../app-data/TopicsAppData'
import { Space } from './Space'

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
}

export type SearchApp = BaseApp & { type: 'search'; data: SearchAppData }
export type PeopleApp = BaseApp & { type: 'people'; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics'; data: TopicsAppData }
export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }

export type App = SearchApp | PeopleApp | TopicsApp | ListsApp
