import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingForceSyncCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SettingEntity } from '@mcro/entities'
import { Syncers } from '../core/Syncers'
import { Syncer } from '../core/Syncer'
import { SyncerGroup } from '../core/SyncerGroup'

const log = new Logger(`command:setting-force-sync`)

export const SettingForceSyncResolver = resolveCommand(SettingForceSyncCommand, async ({ settingId }) => {

  const setting = await getRepository(SettingEntity).findOne({ id: settingId })
  if (!setting) {
    log.error(`cannot find requested setting`, { settingId })
    return
  }

  log.info(`force syncing setting`, setting)
  for (let syncer of Syncers) {
    if (syncer instanceof SyncerGroup) {
      for (let groupSyncer of syncer.syncers) {
        if (groupSyncer.options.type === setting.type) {
          await groupSyncer.runSyncer(setting);
        }
      }

    } else if (syncer instanceof Syncer) {
      if (syncer.options.type === setting.type) {
        await syncer.runSyncer(setting);
      }
    }
  }
  log.info(`force syncing is finished`)
})