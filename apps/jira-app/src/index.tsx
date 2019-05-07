import { createApi, createApp } from '@o/kit'

import { JiraApi } from './api.node'
import { jiraIcon } from './jiraIcon'
import { JiraLoader } from './JiraLoader'
import { JiraAppData } from './JiraModels'

export default createApp<JiraAppData>({
  id: 'jira',
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'markdown',
  sync: true,
  api: createApi<typeof JiraApi>(),
  setupValidate: async app => {
    const loader = new JiraLoader(app)
    await loader.test()
    app.name = extractTeamNameFromDomain(app.data.setup.domain)
  },
  setup: {
    domain: {
      name: 'Domain',
      required: true,
    },
    username: {
      name: 'Username',
      required: true,
    },
    password: {
      name: 'Password',
      required: true,
    },
  },
})

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}
