import { AppWorker, Syncer } from '@o/worker-kit'

import { GithubSyncer } from './GithubSyncer.node'

export const GithubSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'github',
    name: 'Github',
    runner: GithubSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
