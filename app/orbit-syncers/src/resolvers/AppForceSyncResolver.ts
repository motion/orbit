import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { AppEntity, AppForceSyncCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { Syncer } from '../Syncer'
import { Syncers } from '../Syncers'

const log = new Logger('command:app-force-sync')

export const AppForceSyncResolver: any = resolveCommand(AppForceSyncCommand, async ({ appId }) => {
  const app = await getRepository(AppEntity).findOne({ where: { id: appId } })
  if (!app) {
    log.error('cannot find requested app', { appId })
    return
  }

  log.info('force syncing app', app)
  for (let syncer of Syncers) {
    if (syncer instanceof Syncer) {
      if (syncer.options.appIdentifier === app.identifier) {
        const syncerLogger = new Logger(`command:app-force-sync:${app.identifier}:${app.id}`)
        await syncer.runSyncer(syncerLogger, app)
      }
    }
  }
  log.info('force syncing is finished')
})
