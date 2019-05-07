import { createApi, createApp } from '@o/kit'

import { JiraApi } from './api.node'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { jiraIcon } from './jiraIcon'

export default createApp({
  id: 'jira',
  name: 'Jira',
  icon: jiraIcon,
  itemType: 'task',
  settings: AtlassianSettingLogin,
  setup: AtlassianSettingLogin,
  sync: {},
  api: createApi<typeof JiraApi>(),
})
