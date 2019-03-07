import { SlackSyncer } from './SlackSyncer'

export default {
  id: 'slack',
  name: 'Slack',
  runner: SlackSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
