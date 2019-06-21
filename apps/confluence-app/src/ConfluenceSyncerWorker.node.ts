import { AppWorker, Syncer } from '@o/worker-kit'

import { ConfluenceSyncer } from './ConfluenceSyncer.node'

export const ConfluenceSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'confluence',
    name: 'Confluence',
    runner: ConfluenceSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
