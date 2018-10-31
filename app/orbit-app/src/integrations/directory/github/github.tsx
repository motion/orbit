import { GithubApp } from './views/GithubApp'
import { GithubSettings } from './views/GithubSettings'
import { Source } from '@mcro/models'
import icon from '../../../../public/icons/github.svg'
import iconLight from '../../../../public/icons/github-white.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GithubItem } from './views/GithubItem'

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
