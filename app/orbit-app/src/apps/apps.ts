import { RecentApp } from './recent/RecentApp'
import { ListsApp } from './lists/ListsApp'
import { TopicsApp } from './topics/TopicsApp'
import { PeopleApp } from './people/PeopleApp'
import { SearchApp } from './search/SearchApp'
import { AppProps } from './AppProps'

type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

type App = GenericComponent<AppProps>

type AppsIndex = { [key in AppType]: App }

export const apps: AppsIndex = {
  recent: RecentApp,
  search: SearchApp,
  people: PeopleApp,
  topics: TopicsApp,
  lists: ListsApp,
}

export type AppType = 'recent' | 'search' | 'people' | 'topics' | 'lists'
