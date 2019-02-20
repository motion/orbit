import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
// @ts-ignore
import iconLight from './github-white.svg'
// @ts-ignore
import icon from './github.svg'
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
