import { BitEntity, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { Job, SettingRemoveCommand } from '@mcro/models'
import { hash } from '@mcro/utils'
import { getManager, getRepository, In } from 'typeorm'

const log = new Logger('command:setting-remove')

export const SettingRemoveResolver = resolveCommand(SettingRemoveCommand, async ({ settingId }) => {
  // load setting that we should remove
  const setting = await getRepository(SettingEntity).findOne({
    id: settingId,
  })
  if (!setting) {
    log.info('error - cannot find requested setting', { settingId })
    return
  }

  // create a job about removing setting
  const job: Job = {
    target: 'job',
    syncer: '',
    setting: setting,
    time: new Date().getTime(),
    type: 'INTEGRATION_REMOVE',
    status: 'PROCESSING',
    message: '',
  }
  await getRepository(JobEntity).save(job)
  log.info('created a new job', job)

  // remove setting and all its related data
  log.info('removing setting', setting)
  await getManager()
    .transaction(async manager => {
      // removing all synced bits
      const bits = await manager.find(BitEntity, { settingId })
      log.info('removing bits...', bits)
      await manager.remove(bits, { chunk: 100 })
      log.info('bits were removed')

      // removing all integration people
      const persons = await manager.find(PersonEntity, { settingId })
      log.info('removing integration people...', persons)
      await manager.remove(persons, { chunk: 100 })
      log.info('integration people were removed')

      // get person bits which we are going to filter and find which ones we will remove
      log.info('loading person bits related to persons', persons)
      const personBitIds = persons.map(person => hash(person.email))
      const personBits = await manager.find(PersonBitEntity, {
        relations: {
          people: true
        },
        where: {
          id: In(personBitIds)
        }
      })
      log.info('loaded person bits', personBits)

      // find out which of person bits we will remove
      const removedPersonBits = personBits.filter(personBit => personBit.people.length === 0)
      log.info('person bits to be removed', removedPersonBits)
      await manager.remove(PersonBitEntity, removedPersonBits, { chunk: 100 })
      log.info('person were removed')
      // todo: update person bit's "hasGmail", "hasSlack", etc. flags too.

      // removing jobs (including that one we created just now)
      const jobs = await manager.find(JobEntity, { settingId })
      log.info('removing jobs...', jobs)
      await manager.remove(jobs)
      log.info('jobs were removed')

      // removing setting itself
      log.info('finally removing setting itself...')
      await manager.remove(setting)
      log.info('setting was removed')
    })
    .catch(async error => {
      log.error('error during setting removal', error)
      await getRepository(JobEntity).remove(job as JobEntity)
    })
})
