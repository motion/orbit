import { GetOrbitIntegrations, OrbitIntegrations } from '@mcro/kit'
import { confluence } from './confluence/confluence'
import { drive } from './drive/drive'
import { github } from './github/github'
import { gmail } from './gmail/gmail'
import { jira } from './jira/jira'
import { person } from './person/person'
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
  person,
  pinned: () => null,
}

export const allIntegrations = {} as OrbitIntegrations
for (const key in getIntegrations) {
  allIntegrations[key] = getIntegrations[key]({} as any)
}
