import { logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingRemoveCommand } from '@mcro/models'
import { getManager, getRepository } from 'typeorm'
import { BitEntity } from '../entities/BitEntity'
import { JobEntity } from '../entities/JobEntity'
import { PersonEntity } from '../entities/PersonEntity'
import { SettingEntity } from '../entities/SettingEntity'

const log = logger(`command:setting-remove`)

export const SettingRemoveResolver = resolveCommand(SettingRemoveCommand, async ({ settingId }) => {

  const setting = await getRepository(SettingEntity).findOne({ id: settingId })
  if (!setting) {
    log(`error - cannot find requested setting`, { settingId })
    return
  }

  log(`removing setting`, setting)
  await getManager()
    .transaction(async manager => {

      // removing all synced bits
      const bits = await manager.find(BitEntity, { settingId })
      log(`removing bits...`, bits)
      await manager.remove(bits)
      log(`bits were removed`)

      // removing all integration people
      const persons = await manager.find(PersonEntity, { settingId })
      log(`removing integration people...`, persons)
      await manager.remove(persons)
      log(`integration people were removed`)

      // todo: also update person bit entities

      // removing jobs
      const jobs = await manager.find(JobEntity, { settingId })
      log(`removing jobs...`, jobs)
      await manager.remove(jobs)
      log(`jobs were removed`)

      // removing setting itself
      log(`finally removing setting itself...`)
      await manager.remove(setting)
      log(`setting was removed`)
    })
    .catch(error => {
      log(`error during setting removal`, error)
    })
})