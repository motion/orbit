import { Source } from '@mcro/models'
import iconSlack from '../../../../public/icons/slack.svg'
import { findManyType } from '../../helpers/queries'
import { GetOrbitIntegration } from '../../types'
import SlackApp from './views/SlackApp'
import { SlackItem } from './views/SlackItem'
import SlackSettings from './views/SlackSettings'

export const slack: GetOrbitIntegration<'slack'> = (source?: Source) => ({
  modelType: 'bit',
  appName: 'Slack',
  integration: 'slack',
  defaultQuery: findManyType('slack'),
  display: {
    name: source.name,
    itemName: 'conversation',
    icon: iconSlack,
  },
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})
