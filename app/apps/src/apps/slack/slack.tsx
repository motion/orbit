import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import SlackApp from './SlackApp'
import { slackIcon } from './slackIcon'
import { SlackItem } from './SlackItem'
import SlackSettings from './SlackSettings'

export const slack: GetOrbitIntegration<'slack'> = (source?: Source) => ({
  modelType: 'bit',
  appName: 'Slack',
  integration: 'slack',
  display: {
    name: source.name,
    itemName: 'conversation',
    icon: slackIcon,
  },
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})
