import { JiraSyncer } from './JiraSyncer.node'

export default {
  id: 'jira',
  name: 'Jira',
  runner: JiraSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
