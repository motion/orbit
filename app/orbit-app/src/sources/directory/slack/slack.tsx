import SlackApp from './views/SlackApp'
import SlackSettings from './views/SlackSettings'
import { Source } from '@mcro/models'
import iconSlack from '../../../../public/icons/slack.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { SlackItem } from './views/SlackItem'

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
