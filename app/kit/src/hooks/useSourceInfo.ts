import { useModel, useModelCount } from '@mcro/bridge'
import { BitModel, Job, JobModel, Source } from '@mcro/models'

export function useSourceInfo(
  source: Source | false,
): {
  bitsCount: number
  lastJob: Job
} {
  const hasSource = source !== false
  const sourceId = source && source.id
  const bitsCount = useModelCount(BitModel, hasSource && { where: { sourceId } })
  const [lastJob] = useModel(
    JobModel,
    hasSource && {
      where: { sourceId },
      order: { id: 'DESC' },
    },
  )
  return {
    bitsCount,
    lastJob,
  }
}
