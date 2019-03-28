import { createApi, createApp } from '@o/kit'
import React from 'react'
import { jiraIcon } from './jiraIcon'
import { JiraSetup } from './JiraSetup'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { JiraApi } from './api.node'

export default createApp({
  id: 'jira',
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'task',
  settings: props => <AtlassianSettingLogin identifier="jira" {...props} />,
  setup: JiraSetup,
  sync: {},
  api: createApi<typeof JiraApi>(),
})
