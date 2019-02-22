import { GetOrbitIntegrations, OrbitIntegrations } from '@mcro/kit'
import { confluence } from './confluence/confluence'
import * as CustomApp from './custom/main'
import { drive } from './drive/drive'
import { github } from './github/github'
import { gmail } from './gmail/gmail'
import { jira } from './jira/jira'
import * as ListsApp from './lists/main'
import * as PeopleApp from './people/main'
import * as SearchApp from './search/main'
// import { people } from './people/people'
import { slack } from './slack/slack'
import { website } from './website/website'

export const getIntegrations: GetOrbitIntegrations = {
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

export const allIntegrations = {} as OrbitIntegrations
for (const key in getIntegrations) {
  allIntegrations[key] = getIntegrations[key]({} as any)
}

export const allApps = {
  lists: ListsApp,
  search: SearchApp,
  people: PeopleApp,
  custom: CustomApp,
}
