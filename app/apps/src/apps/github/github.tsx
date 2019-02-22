import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { GithubApp } from './GithubApp'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import { GithubItem } from './GithubItem'
import GithubSettings from './GithubSettings'

export const github: GetOrbitIntegration<'github'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'github',
  appName: 'Github',
  display: {
    name: source.name,
    itemName: 'task',
    icon: githubIcon,
    iconLight: githubIconWhite,
  },
  views: {
    main: GithubApp,
    item: GithubItem,
    setting: GithubSettings,
  },
})
