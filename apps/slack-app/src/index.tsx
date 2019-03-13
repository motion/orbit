import { createApp } from '@o/kit'
import { slackIcon } from './slackIcon'
import { SlackSettings } from './SlackSettings'
import SlackApi from './api'

export default createApp({
  id: 'slack',
  name: 'Slack',
  icon: slackIcon,
  itemType: 'conversation',
  settings: SlackSettings,
  sync: {},
  API: SlackApi
})
