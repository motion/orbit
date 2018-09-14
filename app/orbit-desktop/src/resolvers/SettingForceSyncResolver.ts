import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingForceSyncCommand, SettingRemoveCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SettingEntity } from '../entities/SettingEntity'
import { Syncers } from '../syncer'
import { Syncer } from '../syncer/core/Syncer'
import { SyncerGroup } from '../syncer/core/SyncerGroup'

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