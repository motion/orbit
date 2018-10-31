import { GithubApp } from './views/GithubApp'
import { GithubSettings } from './views/GithubSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/github.svg'
// @ts-ignore
import iconLight from '../../../../public/icons/github-white.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GithubItem } from './views/GithubItem'

export const github: GetOrbitIntegration<'github'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'github',
  appName: 'Github',
  defaultQuery: findManyType('github'),
  display: {
    name: setting.name,
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
