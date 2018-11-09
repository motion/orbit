import { ListsAppData } from './app-data/ListsAppData'
import { PeopleAppData } from './app-data/PeopleAppData'
import { SearchAppData } from './app-data/SearchAppData'
import { TopicsAppData } from './app-data/TopicsAppData'
import { Space } from './Space'

export type AppType = 'search' | 'people' | 'topics' | 'lists' | 'source'

export type BaseApp = {
  id?: number
  name?: string
  spaceId?: number
  space?: Space
  type?: AppType
}

export type SearchApp = BaseApp & { type: 'search'; data: SearchAppData }
export type PeopleApp = BaseApp & { type: 'people'; data: PeopleAppData }
export type TopicsApp = BaseApp & { type: 'topics'; data: TopicsAppData }
export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }

export type App = SearchApp | PeopleApp | TopicsApp | ListsApp
