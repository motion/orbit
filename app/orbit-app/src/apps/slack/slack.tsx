import { OrbitApp } from '../OrbitApp'
import { SlackApp } from './SlackApp'
import { SlackAppSettings } from './SlackAppSettings'

export const slack: OrbitApp = {
  icon: '',
  source: 'slack',
  name: 'Slack',
  defaultQuery: {},
  view: SlackApp,
  settings: SlackAppSettings,
}
