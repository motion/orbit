import { GithubApp } from './views/GithubApp'
import { GithubSettings } from './views/GithubSettings'
import { Setting, GenericBit } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/github.svg'
// @ts-ignore
import iconLight from '../../../../public/icons/github-white.svg'
import { GetOrbitApp, ItemProps } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GithubItem } from './views/GithubItem'

export const github: GetOrbitApp<'github'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'slack',
  integrationName: 'Slack',
  defaultQuery: (findManyType('slack') as unknown) as any,
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

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
