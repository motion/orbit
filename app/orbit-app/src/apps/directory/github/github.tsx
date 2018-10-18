import { GithubApp } from './views/GithubApp'
import { GithubSettings } from './views/GithubSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/github.svg'
// @ts-ignore
import iconLight from '../../../../public/icons/github-white.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GithubItem } from './views/GithubItem'

export const github: GetOrbitApp<'github'> = (setting?: Setting) => ({
  id: setting.id,
  source: 'bit',
  integration: 'github',
  integrationName: 'Github',
  defaultQuery: findManyType('github'),
  display: {
    name: setting.name,
    icon,
    iconLight,
  },
  views: {
    main: GithubApp,
    item: GithubItem,
    setting: GithubSettings,
  },
})
