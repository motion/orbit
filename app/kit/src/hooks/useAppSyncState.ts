import { useModel, useModelCount } from '@o/bridge'
import { AppBit, BitModel, Job, JobModel } from '@o/models'

export function useAppSyncState(
  app: AppBit | false,
): {
  bitsCount: number
  lastJob: Job
} {
  const hasApp = app !== false
  const appId = app && app.id
  const bitsCount = useModelCount(BitModel, hasApp && { where: { appId } })
  const [lastJob] = useModel(
    JobModel,
    hasApp && {
      where: { appId },
      order: { id: 'DESC' },
    },
  )
  return {
    bitsCount,
    lastJob,
  }
}
