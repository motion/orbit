import { BitModel, SourceModel, JobModel } from '@mcro/models'
import { useModel, useModelCount } from '@mcro/model-bridge'

export function useSourceInfo(sourceId: number | false) {
  const hasSourceId = sourceId !== false
  const source = useModel(
    SourceModel,
    hasSourceId && {
      where: {
        id: sourceId,
      },
    },
  )
  const bitsCount = useModelCount(BitModel, hasSourceId && { where: { sourceId } })
  const lastJob = useModel(
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
