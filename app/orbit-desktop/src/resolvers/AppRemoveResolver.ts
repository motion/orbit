import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppBit, AppEntity, AppRemoveCommand, BitEntity, Job, JobEntity } from '@o/models'
import { getManager, getRepository } from 'typeorm'

const log = new Logger('command:app-remove')

export const AppRemoveResolver = resolveCommand(AppRemoveCommand, async ({ appId }) => {
  // load app that we should remove
  const app = await getRepository(AppEntity).findOne({
    id: appId,
  })

  if (!app) {
    log.info('error - cannot find requested app', { appId })
    return {
      type: 'error',
      message: `Can't find app ${appId}`,
    } as const
  }

  // create a job about removing app
  const job: Job = {
    target: 'job',
    syncer: '',
    app: app as AppBit,
    time: new Date().getTime(),
    type: 'APP_REMOVE',
    status: 'PROCESSING',
    message: '',
  }
  await getRepository(JobEntity).save(job)
  log.info('created a new job', job)

  // remove app and all its related data
  log.info('removing app', app)
  await getManager()
    .transaction(async manager => {
      // removing all synced bits
      const bits = await manager.find(BitEntity, { appId })
      log.info('removing bits...', bits)
      await manager.remove(bits, { chunk: 100 })
      log.info('bits were removed')

      // removing jobs (including that one we created just now)
      const jobs = await manager.find(JobEntity, { appId })
      log.info('removing jobs...', jobs)
      await manager.remove(jobs)
      log.info('jobs were removed')

      // removing app itself
      log.info('finally removing app itself...')
      await manager.remove(app)
      log.info('app was removed')
    })
    .catch(async error => {
      log.error('error during app removal', error)
      await getRepository(JobEntity).remove(job as JobEntity)
    })

  return {
    type: 'success',
    message: `Removed app and all associated data`,
  } as const
})
