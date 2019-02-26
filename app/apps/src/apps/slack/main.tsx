import { AppDefinition } from '@mcro/kit'
import { slackIcon } from './slackIcon'
import SlackSettings from './SlackSettings'

export const id = 'slack'

export const app: AppDefinition = {
  name: 'Slack',
  icon: slackIcon,
  itemType: 'conversation',
  sync: {
    sourceType: 'slack',
    settings: SlackSettings,
  },
}
