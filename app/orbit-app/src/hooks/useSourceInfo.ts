import { BitModel, SourceModel, JobModel } from '@mcro/models'
import { useObserveOne, useObserveCount } from '@mcro/model-bridge'

export function useSourceInfo(sourceId: number | false) {
  const hasSourceId = sourceId !== false
  const source = useObserveOne(
    SourceModel,
    hasSourceId && {
      where: {
        id: sourceId,
      },
    },
  )
  const bitsCount = useObserveCount(BitModel, hasSourceId && { where: { sourceId } })
  const lastJob = useObserveOne(
    JobModel,
    hasSourceId && {
      where: { sourceId },
      order: { id: 'DESC' },
    },
  )
  return {
    source,
    bitsCount,
    lastJob,
  }
}
