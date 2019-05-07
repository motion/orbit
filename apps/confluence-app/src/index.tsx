import { createApi, createApp } from '@o/kit'

import { ConfluenceApi } from './api.node'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceAppData } from './ConfluenceModels'

export default createApp<ConfluenceAppData>({
  id: 'confluence',
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  sync: true,
  api: createApi<typeof ConfluenceApi>(),
  setupValidate: async app => {
    const loader = new ConfluenceLoader(app)
    await loader.test()
    app.name = extractTeamNameFromDomain(app.data.setup.domain)
    return true
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
