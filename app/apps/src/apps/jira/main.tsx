import { JiraApp } from './JiraApp'
import { jiraIcon } from './jiraIcon'
import { JiraItem } from './JiraItem'
import { JiraSettings } from './JiraSettings'
import { JiraSetup } from './JiraSetup'

export const jira = {
  name: 'Jira',
  modelType: 'bit',
  sourceType: 'jira',
  itemName: 'task',
  icon: jiraIcon,
  views: {
    main: JiraApp,
    item: JiraItem,
    setting: JiraSettings,
    setup: JiraSetup,
  },
}
