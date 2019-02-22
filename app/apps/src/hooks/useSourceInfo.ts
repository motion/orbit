import { useModel, useModelCount } from '@mcro/bridge'
import { BitModel, Job, JobModel, Source, SourceModel } from '@mcro/models'

export function useSourceInfo(
  sourceId: number | false,
): {
  source: Source
  bitsCount: number
  lastJob: Job
} {
  const hasSourceId = sourceId !== false
  const [source] = useModel(
    SourceModel,
    hasSourceId && {
      where: {
        id: sourceId,
      },
    },
  )
  const bitsCount = useModelCount(BitModel, hasSourceId && { where: { sourceId } })
  const [lastJob] = useModel(
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
