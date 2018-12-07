import { ListsAppData } from '../app-data/ListsAppData'
import { PeopleAppData } from '../app-data/PeopleAppData'
import { SearchAppData } from '../app-data/SearchAppData'
import { TopicsAppData } from '../app-data/TopicsAppData'
import { Space } from './Space'

export type AppType =
  | 'home'
  | 'search'
  | 'people'
  | 'topics'
  | 'lists'
  | 'sources'
  | 'bit'
  | 'settings'

export type AppConfig = {
  type: AppType
  id: string
  icon?: string
  iconLight?: string
  title: string
  integration?: string
  subType?: string
  viewType?: 'main' | 'index' | 'setup'
  // allow various things to be passed as config
  // to help configure the peek window
  viewConfig?: {
    showTitleBar?: boolean
    viewPane?: string
    dimensions?: [number, number]
    // for auto measuring peek size
    contentSize?: number
    initialState?: { [key: string]: any }
  }
}

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
