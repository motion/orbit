import { AppDefinition } from '@mcro/kit'
import React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'
import { jiraIcon } from './jiraIcon'
import { JiraSetup } from './JiraSetup'

export const id = 'jira'

export const app: AppDefinition = {
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'task',
  sync: {
    sourceType: 'jira',
    settings: props => <AtlassianSettingLogin type="jira" {...props} />,
    setup: JiraSetup,
  },
}
