import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppBit, AppEntity, AppRemoveCommand, BitEntity, Job, JobEntity } from '@o/models'
import { OR_TIMED_OUT, orTimeout } from '@o/ui'
import { getConnection, getManager, getRepository } from 'typeorm'

const log = new Logger('command:app-remove')

const bitRemoveFailures = new Set<number>()

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

  let error = ''

  // remove app and all its related data
  log.info('removing app', app)
  await getManager()
    .transaction(async manager => {
      // removing all synced bits
      const bits = await manager.find(BitEntity, { where: { appId }, select: ['id'] })
      log.info('removing bits...', bits)

      if (bitRemoveFailures.has(appId)) {
        const connection = getConnection()
        await connection.query(`DELETE FROM bit_entity WHERE appId = $1;`, [appId])
        // TODO
        // await connection.query(`DELETE FROM bit_entity_people_bit_entity WHERE bitEntityId_1 = $1;`, [appId])
      } else {
        // TODO I saw this failing easily with just a few slack messages synced in, so added this alternate delete method
        // but its not ideal
        try {
          const numBits = bits.length
          const chunk = numBits / 10 // lets delete small amount at a time to be conservative it seems to slow down over time
          await orTimeout(manager.remove(bits, { chunk }), 10 * 1000)
        } catch (err) {
          if (err === OR_TIMED_OUT) {
            bitRemoveFailures.add(appId)
            return {
              type: 'error',
              message: `Timed out removing bits took more than 10 seconds. Try again to force remove.`,
            } as const
          }
          throw err
        }
      }
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
      error = error.message
      await getRepository(JobEntity).remove(job as JobEntity)
    })

  if (error) {
    return {
      type: 'error',
      message: error,
    }
  }

  return {
    type: 'success',
    message: `Removed app and all associated data`,
  } as const
})
