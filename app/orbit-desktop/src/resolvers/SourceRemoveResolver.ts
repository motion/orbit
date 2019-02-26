import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import {
  BitEntity,
  Job,
  JobEntity,
  PersonBitEntity,
  PersonEntity,
  SourceEntity,
  SourceRemoveCommand,
} from '@mcro/models'
import { hash } from '@mcro/utils'
import { getManager, getRepository, In } from 'typeorm'

const log = new Logger('command:source-remove')

export const SourceRemoveResolver = resolveCommand(SourceRemoveCommand, async ({ sourceId }) => {
  // load source that we should remove
  const source = await getRepository(SourceEntity).findOne({
    id: sourceId,
  })
  if (!source) {
    log.info('error - cannot find requested source', { sourceId })
    return
  }

  // create a job about removing source
  const job: Job = {
    target: 'job',
    syncer: '',
    source,
    time: new Date().getTime(),
    type: 'SOURCE_REMOVE',
    status: 'PROCESSING',
    message: '',
  }
  await getRepository(JobEntity).save(job)
  log.info('created a new job', job)

  // remove source and all its related data
  log.info('removing source', source)
  await getManager()
    .transaction(async manager => {
      // removing all synced bits
      const bits = await manager.find(BitEntity, { sourceId })
      log.info('removing bits...', bits)
      await manager.remove(bits, { chunk: 100 })
      log.info('bits were removed')

      // removing all source people
      const persons = await manager.find(PersonEntity, { sourceId })
      log.info('removing source people...', persons)
      await manager.remove(persons, { chunk: 100 })
      log.info('source people were removed')

      // get person bits which we are going to filter and find which ones we will remove
      log.info('loading person bits related to persons', persons)
      const personBitIds = persons.map(person => hash(person.email))
      const personBits = await manager.find(PersonBitEntity, {
        relations: {
          people: true,
        },
        where: {
          id: In(personBitIds),
        },
      })
      log.info('loaded person bits', personBits)

      // find out which of person bits we will remove
      const removedPersonBits = personBits.filter(personBit => personBit.people.length === 0)
      log.info('person bits to be removed', removedPersonBits)
      await manager.remove(PersonBitEntity, removedPersonBits, { chunk: 100 })
      log.info('person were removed')
      // todo: update person bit's "hasGmail", "hasSlack", etc. flags too.

      // removing jobs (including that one we created just now)
      const jobs = await manager.find(JobEntity, { sourceId })
      log.info('removing jobs...', jobs)
      await manager.remove(jobs)
      log.info('jobs were removed')

      // removing source itself
      log.info('finally removing source itself...')
      await manager.remove(source)
      log.info('source was removed')
    })
    .catch(async error => {
      log.error('error during source removal', error)
      await getRepository(JobEntity).remove(job as JobEntity)
    })
})
