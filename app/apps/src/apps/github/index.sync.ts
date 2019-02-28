import { GithubSyncer } from './GithubSyncer'

export default {
  runner: GithubSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
