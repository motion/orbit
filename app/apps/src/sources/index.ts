import { GetOrbitIntegrations, OrbitIntegrations } from '@mcro/kit'
import { confluence } from './directory/confluence/confluence'
import { drive } from './directory/drive/drive'
import { github } from './directory/github/github'
import { gmail } from './directory/gmail/gmail'
import { jira } from './directory/jira/jira'
import { person } from './directory/person/person'
import { slack } from './directory/slack/slack'
import { website } from './directory/website/website'

export const getIntegrations: GetOrbitIntegrations = {
  slack,
  github,
  gmail,
  jira,
  confluence,
  drive,
  website,
  person,
  pinned: () => null,
}

export const allIntegrations = {} as OrbitIntegrations
for (const key in getIntegrations) {
  allIntegrations[key] = getIntegrations[key]({} as any)
}
