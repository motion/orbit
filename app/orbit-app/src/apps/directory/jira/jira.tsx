import { JiraApp } from './views/JiraApp'
import { JiraSettings } from './views/JiraSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/jira.svg'
// @ts-ignore
import iconLight from '../../../../public/icons/jira-white.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { JiraItem } from './views/JiraItem'

export const jira: GetOrbitApp<'jira'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'jira',
  integrationName: 'Jira',
  defaultQuery: findManyType('jira'),
  display: {
    name: setting.name,
    icon,
    iconLight,
  },
  views: {
    main: JiraApp,
    item: JiraItem,
    setting: JiraSettings,
  },
})
