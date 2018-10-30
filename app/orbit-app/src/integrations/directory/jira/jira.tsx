import { JiraApp } from './views/JiraApp'
import { JiraSettings } from './views/JiraSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/jira.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { JiraItem } from './views/JiraItem'
import { JiraSetup } from './views/JiraSetup'

export const jira: GetOrbitIntegration<'jira'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'jira',
  appName: 'Jira',
  defaultQuery: findManyType('jira'),
  display: {
    name: setting.name,
    itemName: 'task',
    icon,
  },
  views: {
    main: JiraApp,
    item: JiraItem,
    setting: JiraSettings,
    setup: JiraSetup,
  },
})
