import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import { GithubApp } from './views/GithubApp'
import { GithubItem } from './views/GithubItem'
import GithubSettings from './views/GithubSettings'

export const github: GetOrbitIntegration<'github'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'github',
  appName: 'Github',
  defaultQuery: findManyType('github'),
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
