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
}

//
// All orbit app configs
// pass in "blank" setting to get the basic information for each app
//
export const allIntegrations: OrbitIntegrations = Object.keys(getIntegrations).reduce(
  (acc, key) => ({
    ...acc,
    [key]: getIntegrations[key]({} as any),
  }),
  {} as OrbitIntegrations,
)
