import { GetOrbitApp, GetOrbitApps, AppType, OrbitApp } from './types'
import { slack } from './directory/slack/slack'
import { github } from './directory/github/github'
import { gmail } from './directory/gmail/gmail'
import { jira } from './directory/jira/jira'
import { confluence } from './directory/confluence/confluence'
import { drive } from './directory/drive/drive'

export const getApps: GetOrbitApps = {
  slack,
  github,
  gmail,
  jira,
  confluence,
  drive,
  person: (slack as unknown) as GetOrbitApp<'person'>,
  website: (slack as unknown) as GetOrbitApp<'website'>,
  app1: (slack as unknown) as GetOrbitApp<'app1'>,
}

type OrbitApps = { [key in AppType]: OrbitApp<any> }

//
// All orbit app configs
// pass in "blank" setting to get the basic information for each app
//
export const allApps: OrbitApps = Object.keys(getApps).reduce(
  (acc, key) => ({
    ...acc,
    [key]: getApps[key]({}),
  }),
  {} as OrbitApps,
)
