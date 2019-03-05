import { createApp } from '@mcro/kit'
import { slackIcon } from './slackIcon'
import { SlackSettings } from './SlackSettings'

export default createApp({
  id: 'slack',
  name: 'Slack',
  icon: slackIcon,
  itemType: 'conversation',
  settings: SlackSettings,
  sync: {},
})
