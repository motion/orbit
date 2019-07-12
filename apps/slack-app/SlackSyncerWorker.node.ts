import { AppWorker, Syncer } from '@o/worker-kit'

import { SlackSyncer } from './SlackSyncer.node'

export const SlackSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'slack',
    appIdentifier: 'slack',
    name: 'Slack',
    runner: SlackSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
