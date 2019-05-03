import 'slack'

import { createApi, createApp } from '@o/kit'

import { SlackApi } from './api.node'
import { slackIcon } from './slackIcon'
import { SlackSettings } from './SlackSettings'

export * from './SlackConversation'

export default createApp({
  id: 'slack',
  name: 'Slack',
  icon: slackIcon,
  itemType: 'conversation',
  settings: SlackSettings,
  sync: {},
  api: createApi<typeof SlackApi>(),
})
