import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SourceEntity, SourceForceSyncCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { Syncer } from '../core/Syncer'
import { Syncers } from '../core/Syncers'

const log = new Logger('command:setting-force-sync')

export const SourceForceSyncResolver: any = resolveCommand(
  SourceForceSyncCommand,
  async ({ sourceId }) => {
    const setting = await getRepository(SourceEntity).findOne({ where: { id: sourceId } })
    if (!setting) {
      log.error('cannot find requested setting', { sourceId })
      return
    }

    log.info('force syncing setting', setting)
    for (let syncer of Syncers) {
      if (syncer instanceof Syncer) {
        if (syncer.options.type === setting.type) {
          const syncerLogger = new Logger(
            `command:setting-force-sync:${setting.type}:${setting.id}`,
          )
          await syncer.runSyncer(syncerLogger, setting)
        }
      }
    }
    log.info('force syncing is finished')
  },
)
