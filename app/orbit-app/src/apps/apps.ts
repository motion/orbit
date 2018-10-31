import { HomeApp } from './home/HomeApp'
import { ListsApp } from './lists/ListsApp'
import { TopicsApp } from './topics/TopicsApp'
import { PeopleApp } from './people/PeopleApp'
import { SearchApp } from './search/SearchApp'

export const apps = {
  home: HomeApp,
  search: SearchApp,
  people: PeopleApp,
  topics: TopicsApp,
  lists: ListsApp,
}
