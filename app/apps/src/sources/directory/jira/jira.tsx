import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { JiraApp } from './JiraApp'
import { jiraIcon } from './jiraIcon'
import { JiraItem } from './JiraItem'
import { JiraSettings } from './JiraSettings'
import { JiraSetup } from './JiraSetup'

export const jira: GetOrbitIntegration<'jira'> = (source?: Source) => ({
  modelType: 'bit',
  integration: 'jira',
  appName: 'Jira',
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
