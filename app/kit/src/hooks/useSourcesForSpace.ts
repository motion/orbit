import { useModels } from '@mcro/bridge'
import { SourceModel } from '@mcro/models'

export function useSourcesForSpace(spaceId: number | false) {
  return useModels(
    SourceModel,
    typeof spaceId === 'number' ? { where: { spaces: { $in: [spaceId] } } } : false,
  )[0]
}
