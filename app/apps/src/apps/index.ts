import { GetOrbitSources, OrbitSources } from '@mcro/kit'
import { confluence } from './confluence/main'
import * as CustomApp from './custom/main'
import { drive } from './drive/main'
import { github } from './github/main'
import { gmail } from './gmail/main'
import { jira } from './jira/main'
import * as ListsApp from './lists/main'
import * as PeopleApp from './people/main'
import * as SearchApp from './search/main'
// import { people } from './people/people'
import { slack } from './slack/main'
import { website } from './website/main'

export const getSources: GetOrbitSources = {
  slack,
  github,
  gmail,
  jira,
  confluence,
  drive,
  website,
  // people,
  people: () => null,
  pinned: () => null,
}

export const allSources = {} as OrbitSources
for (const key in getSources) {
  allSources[key] = getSources[key]({} as any)
}

export const allApps = {
  lists: ListsApp,
  search: SearchApp,
  people: PeopleApp,
  custom: CustomApp,
}
