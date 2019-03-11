import { useModels } from '@o/bridge'
import { AppModel } from '@o/models'

export function useAppsForSpace(spaceId: number | false) {
  return useModels(
    AppModel,
    typeof spaceId === 'number' ? { where: { spaces: { $in: [spaceId] } } } : false,
  )[0]
}
