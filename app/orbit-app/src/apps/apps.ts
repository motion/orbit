import { AppType } from '@mcro/models'
import { RecentApp } from './recent/RecentApp'
import { ListsAppComponent } from './lists/ListsApp'
import { TopicsApp } from './topics/TopicsApp'
import { PeopleApp } from './people/PeopleApp'
import { SearchApp } from './search/SearchApp'
import { AppProps } from './AppProps'
import { GenericComponent } from '../types'
import { lists } from './lists'
import { topics } from './topics'
import { people } from './people/people'
import { search } from './search'

type App = {
  index: GenericComponent<AppProps>
  main: GenericComponent<AppProps>
}

type AppsIndex = { [key in AppType]: App }

export const apps: AppsIndex = {
  search,
  people,
  topics,
  lists,
}

