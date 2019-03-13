import { GithubSyncer } from './GithubSyncer'

export default {
  id: 'github',
  name: 'Github',
  runner: GithubSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
