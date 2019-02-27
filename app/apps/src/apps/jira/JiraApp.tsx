import { AppDefinition } from '@mcro/kit'
import React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'
import { jiraIcon } from './jiraIcon'
import { JiraSetup } from './JiraSetup'

export const JiraApp: AppDefinition = {
  id: 'jira',
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'task',
  settings: props => <AtlassianSettingLogin identifier="jira" {...props} />,
  setup: JiraSetup,
  sync: {},
}
