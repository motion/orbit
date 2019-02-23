import { AppDefinition } from '@mcro/kit'
import { jiraIcon } from './jiraIcon'
import { JiraSettings } from './JiraSettings'
import { JiraSetup } from './JiraSetup'

export const app: AppDefinition = {
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'task',
  sync: {
    sourceType: 'jira',
    settings: JiraSettings,
    setup: JiraSetup,
  },
}
