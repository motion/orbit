import { AppWorker, Syncer } from '@o/worker-kit'

import { GMailSyncer } from './GMailSyncer.node'

export const GmailSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'gmail',
    name: 'Gmail',
    runner: GMailSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
