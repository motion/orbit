import { useModels } from '@mcro/bridge'
import { AppModel } from '@mcro/models'

export function useAppsForSpace(spaceId: number | false) {
  return useModels(
    AppModel,
    typeof spaceId === 'number' ? { where: { spaces: { $in: [spaceId] } } } : false,
  )[0]
}
