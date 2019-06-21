import { AppWorker, Syncer } from '@o/worker-kit'

import { JiraSyncer } from './JiraSyncer.node'

export const JiraSyncerWorker: AppWorker = async () => {
  const syncer = new Syncer({
    id: 'jira',
    name: 'Jira',
    runner: JiraSyncer,
    interval: 1000 * 60 * 5, // 5 minutes
  })
  await syncer.start()
}
