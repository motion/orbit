import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { JobEntity, SourceForceCancelCommand } from '@mcro/models'
import { getRepository } from 'typeorm'

const log = new Logger('SourceForceCancelResolver')
const cancelCommands = new Set()

export class SyncerCancelError extends Error {}

export function checkCancelled(sourceId: number) {
  if (cancelCommands.has(sourceId)) {
    cancelCommands.delete(sourceId)
    throw new SyncerCancelError(`Cancelled: ${sourceId}`)
  }
}

export const SourceForceCancelResolver: any = resolveCommand(
  SourceForceCancelCommand,
  async ({ sourceId }) => {
    log.info('canceling', sourceId)
    const lastJob = await getRepository(JobEntity).findOne({
      where: {
        type: 'INTEGRATION_SYNC',
        status: 'PROCESSING',
        sourceId: sourceId,
      },
      order: {
        time: 'desc',
      },
    })

    if (lastJob) {
      await getRepository(JobEntity).remove(lastJob)
      // send cancel to the running syncer so it exits...
      cancelCommands.add(sourceId)
      // prevent weird states, say they click cancel right as it finishes
      // this ensures it wont stick around for too long
      // not the ideal solution but lets see how it does...
      setTimeout(() => {
        cancelCommands.delete(sourceId)
      }, 500)
    }
  },
)
