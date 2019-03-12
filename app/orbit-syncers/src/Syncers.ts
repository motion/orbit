import { syncers } from '@o/apps/_/syncers'
import { Syncer } from './Syncer'

export const Syncers = []
syncers.forEach(app => {
  Syncers.push(
    new Syncer({
      name: app.name,
      appIdentifier: app.id,
      runner: app.runner,
      interval: app.interval,
    }),
  )
})
