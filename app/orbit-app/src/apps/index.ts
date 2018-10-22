import { GetOrbitIntegrations, OrbitIntegrations } from './types'
import { slack } from './directory/slack/slack'
import { github } from './directory/github/github'
import { gmail } from './directory/gmail/gmail'
import { jira } from './directory/jira/jira'
import { confluence } from './directory/confluence/confluence'
import { drive } from './directory/drive/drive'
import { website } from './directory/website/website'
import { person } from './directory/person/person'

export const getApps: GetOrbitIntegrations = {
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
export const allApps: OrbitIntegrations = Object.keys(getApps).reduce(
  (acc, key) => ({
    ...acc,
    [key]: getApps[key]({}),
  }),
  {} as OrbitIntegrations,
)
