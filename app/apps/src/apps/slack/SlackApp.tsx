import { AppDefinition } from '@mcro/kit'
import { slackIcon } from './slackIcon'
import { SlackSettings } from './SlackSettings'

export const SlackApp: AppDefinition = {
  id: 'slack',
  name: 'Slack',
  icon: slackIcon,
  itemType: 'conversation',
  settings: SlackSettings,
  sync: {},
}
