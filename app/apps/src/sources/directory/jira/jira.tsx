import { Source } from '@mcro/models'
import icon from '../../../../public/icons/jira.svg'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration } from '../../types'
import { JiraApp } from './views/JiraApp'
import { JiraItem } from './views/JiraItem'
import { JiraSettings } from './views/JiraSettings'
import { JiraSetup } from './views/JiraSetup'

export const jira: GetOrbitIntegration<'jira'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'jira',
  appName: 'Jira',
  defaultQuery: findManyType('jira'),
  display: {
    name: source.name,
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
