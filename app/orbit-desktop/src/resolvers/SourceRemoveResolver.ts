import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { BitEntity, Job, JobEntity, SourceEntity, SourceRemoveCommand } from '@mcro/models'
import { getManager, getRepository } from 'typeorm'

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
