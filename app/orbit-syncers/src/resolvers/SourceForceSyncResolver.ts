import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SourceForceSyncCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SourceEntity } from '@mcro/models'
import { Syncers } from '../core/Syncers'
import { Syncer } from '../core/Syncer'

const log = new Logger('command:setting-force-sync')

export const SourceForceSyncResolver = resolveCommand(
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
