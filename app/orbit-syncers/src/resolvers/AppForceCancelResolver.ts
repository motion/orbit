import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppForceCancelCommand, JobEntity } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('SourceForceCancelResolver')
const cancelCommands = new Set()

export class AppCancelError extends Error {}

export function checkCancelled(appId: number) {
  if (cancelCommands.has(appId)) {
    cancelCommands.delete(appId)
    throw new AppCancelError(`Cancelled: ${appId}`)
  }
  return true
}

export const AppForceCancelResolver: any = resolveCommand(
  AppForceCancelCommand,
  async ({ appId }) => {
    log.info('canceling', appId)
    const lastJob = await getRepository(JobEntity).findOne({
      where: {
        type: 'APP_SYNC',
        status: 'PROCESSING',
        appId,
      },
      order: {
        time: 'desc',
      },
    })

    if (lastJob) {
      await getRepository(JobEntity).remove(lastJob)
      // send cancel to the running syncer so it exits...
      cancelCommands.add(appId)
      // prevent weird states, say they click cancel right as it finishes
      // this ensures it wont stick around for too long
      // not the ideal solution but lets see how it does...
      setTimeout(() => {
        cancelCommands.delete(appId)
      }, 500)
    }
  },
)
