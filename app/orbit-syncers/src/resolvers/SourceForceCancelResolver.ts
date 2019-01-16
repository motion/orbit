import { resolveCommand } from '@mcro/mediator'
import { SourceForceCancelCommand, JobEntity } from '@mcro/models'
import { getRepository } from '@mcro/mediator/node_modules/typeorm'

const cancelCommands = new Set()

export class SyncerCancelError extends Error {}

export function checkCancelled(sourceId: number) {
  if (cancelCommands.has(sourceId)) {
    cancelCommands.delete(sourceId)
    throw new SyncerCancelError(`Cancelled: ${sourceId}`)
  }
}

export const SourceForceCancelResolver = resolveCommand(
  SourceForceCancelCommand,
  async ({ sourceId }) => {
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
