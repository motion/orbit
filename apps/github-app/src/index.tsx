import { createApi, createApp } from '@o/kit'

import { GithubApi } from './api.node'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import { GithubSettings } from './GithubSettings'
import { graph } from './graph.node'

export default createApp({
  id: 'github',
  name: 'Github',
  icon: githubIcon,
  iconLight: githubIconWhite,
  itemType: 'task',
  settings: GithubSettings,
  api: createApi<typeof GithubApi>(),
  sync: true,
  graph,
})
