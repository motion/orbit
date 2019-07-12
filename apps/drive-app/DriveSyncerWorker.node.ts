import { AppWorker, Syncer } from '@o/worker-kit'

import { DriveSyncer } from './DriveSyncer.node'

export const DriverSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'drive',
    appIdentifier: 'drive',
    name: 'Drive',
    runner: DriveSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
