import iconLight from '!raw-loader!../../../../public/icons/github-white.svg'
import icon from '!raw-loader!../../../../public/icons/github.svg'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration } from '../../types'
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
    icon,
    iconLight,
  },
  views: {
    main: GithubApp,
    item: GithubItem,
    setting: GithubSettings,
  },
})
