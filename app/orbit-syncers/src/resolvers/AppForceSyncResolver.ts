import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { AppBit, AppBitEntity, AppForceSyncCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { Syncer } from '../core/Syncer'
import { Syncers } from '../core/Syncers'

const log = new Logger('command:app-force-sync')

export const AppForceSyncResolver: any = resolveCommand(AppForceSyncCommand, async ({ appId }) => {
  const app = await getRepository(AppBitEntity).findOne({ where: { id: appId } })
  if (!app) {
    log.error('cannot find requested app', { appId })
    return
  }

  log.info('force syncing app', app)
  for (let syncer of Syncers) {
    if (syncer instanceof Syncer) {
      if (syncer.options.type === app.appType) {
        const syncerLogger = new Logger(`command:app-force-sync:${app.appType}:${app.id}`)
        await syncer.runSyncer(syncerLogger, app as AppBit)
      }
    }
  }
  log.info('force syncing is finished')
})
