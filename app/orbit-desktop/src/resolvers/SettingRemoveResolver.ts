import { BitEntity, JobEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingRemoveCommand } from '@mcro/models'
import { getManager, getRepository } from 'typeorm'

const log = new Logger('command:setting-remove')

export const SettingRemoveResolver = resolveCommand(
  SettingRemoveCommand,
  async ({ settingId }) => {
    const setting = await getRepository(SettingEntity).findOne({
      id: settingId,
    })
    if (!setting) {
      log.info('error - cannot find requested setting', { settingId })
      return
    }

    log.info('removing setting', setting)
    await getManager()
      .transaction(async manager => {
        // removing all synced bits
        const bits = await manager.find(BitEntity, { settingId })
        log.info('removing bits...', bits)
        await manager.remove(bits)
        log.info('bits were removed')

        // removing all integration people
        const persons = await manager.find(PersonEntity, { settingId })
        log.info('removing integration people...', persons)
        await manager.remove(persons)
        log.info('integration people were removed')

        // todo: also update person bit entities

        // removing jobs
        const jobs = await manager.find(JobEntity, { settingId })
        log.info('removing jobs...', jobs)
        await manager.remove(jobs)
        log.info('jobs were removed')

        // removing setting itself
        log.info('finally removing setting itself...')
        await manager.remove(setting)
        log.info('setting was removed')
      })
      .catch(error => {
        log.info('error during setting removal', error)
      })
  },
)
