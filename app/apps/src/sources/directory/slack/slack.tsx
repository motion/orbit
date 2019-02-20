import { GetOrbitIntegration } from '@mcro/kit'
import { Source } from '@mcro/models'
import { findManyType } from '../../helpers/queries'
// @ts-ignore
import iconSlack from './slack.svg'
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
