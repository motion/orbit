import { SlackApp } from './views/SlackApp'
import { SlackSettings } from './views/SlackSettings'
import { Setting } from '@mcro/models'
import iconSlack from '../../../../public/icons/slack.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { SlackItem } from './views/SlackItem'

export const slack: GetOrbitIntegration<'slack'> = (setting?: Setting) => ({
  source: 'bit',
  appName: 'Slack',
  integration: 'slack',
  defaultQuery: findManyType('slack'),
  display: {
    name: setting.name,
    itemName: 'conversation',
    icon: iconSlack,
  },
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})
