import { ListsAppData } from './app-data/ListsAppData'
import { PeopleAppData } from './app-data/PeopleAppData'
import { RecentAppData } from './app-data/RecentAppData'
import { SearchAppData } from './app-data/SearchAppData'
import { TopicsAppData } from './app-data/TopicsAppData'

export type AppType =
  | 'recent'
  | 'search'
  | 'people'
  | 'topics'
  | 'lists'

export type BaseApp = {
  id?: number
  name?: string
  type?: AppType
}

export type RecentApp = BaseApp & { type: 'recent', data: RecentAppData }
export type SearchApp = BaseApp & { type: 'search', data: SearchAppData }
export type PeopleApp = BaseApp & { type: 'people', data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics', data: TopicsAppData }
export type ListsApp = BaseApp & { type: 'lists', data: ListsAppData }

export type App =
  | RecentApp
  | SearchApp
  | PeopleApp
  | TopicsApp
  | ListsApp