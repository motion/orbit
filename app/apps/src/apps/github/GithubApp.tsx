import { AppDefinition } from '@mcro/kit'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import GithubSettings from './GithubSettings'

export const GithubApp: AppDefinition = {
  id: 'github',
  name: 'Github',
  icon: githubIcon,
  iconLight: githubIconWhite,
  itemType: 'task',
  sync: {
    sourceType: 'github',
    settings: GithubSettings,
  },
}
