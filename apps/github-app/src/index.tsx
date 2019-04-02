import { createApi, createApp } from '@o/kit'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import GithubSettings from './GithubSettings'
import { GithubApi } from './api.node'

export default createApp({
  id: 'github',
  name: 'Github',
  icon: githubIcon,
  iconLight: githubIconWhite,
  itemType: 'task',
  settings: GithubSettings,
  api: createApi<typeof GithubApi>(),
  sync: {},
})
