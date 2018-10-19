import { SlackApp } from './views/SlackApp'
import { SlackSettings } from './views/SlackSettings'
import { Setting } from '@mcro/models'
// @ts-ignore
import iconSlack from '../../../../public/icons/slack.svg'
import { GetOrbitApp } from '../../types'
import { findManyType } from '../../helpers/queries'
import { SlackItem } from './views/SlackItem'

export const slack: GetOrbitApp<'slack'> = (setting?: Setting) => ({
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
