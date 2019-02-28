import { SlackSyncer } from './SlackSyncer'

export default {
  runner: SlackSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
