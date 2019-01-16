import { resolveCommand } from '@mcro/mediator'
import { SourceForceCancelCommand } from '@mcro/models'

const cancelCommands = new Set()

export class SyncerCancelError extends Error {}

export function checkCancelled(sourceId: number) {
  if (cancelCommands.has(sourceId)) {
    cancelCommands.delete(sourceId)
    throw new SyncerCancelError(`Cancelled: ${sourceId}`)
  }
}

// TODO types got wierd here, remove :any
export const SourceForceCancelResolver: any = resolveCommand(
  SourceForceCancelCommand,
  async ({ sourceId }) => {
    cancelCommands.add(sourceId)
    // prevent weird states, say they click cancel right as it finishes
    // this ensures it wont stick around for too long
    // not the ideal solution but lets see how it does...
    setTimeout(() => {
      cancelCommands.delete(sourceId)
    }, 200)
  },
)
