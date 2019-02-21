import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
import { jiraIcon } from './jiraIcon'
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
    icon: jiraIcon,
  },
  views: {
    main: JiraApp,
    item: JiraItem,
    setting: JiraSettings,
    setup: JiraSetup,
  },
})
