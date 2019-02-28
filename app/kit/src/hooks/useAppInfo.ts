import { useModel, useModelCount } from '@mcro/bridge'
import { AppBit, BitModel, Job, JobModel } from '@mcro/models'

export function useAppInfo(
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
