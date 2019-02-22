import SlackApp from './SlackApp'
import { slackIcon } from './slackIcon'
import { SlackItem } from './SlackItem'
import SlackSettings from './SlackSettings'

export const slack = {
  name: 'Slack',
  modelType: 'bit',
  sourceType: 'slack',
  itemName: 'conversation',
  icon: slackIcon,
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
}
