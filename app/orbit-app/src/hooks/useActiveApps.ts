import { useObserveMany, useObserveOne } from '@mcro/model-bridge'
import { AppModel, SpaceModel } from '@mcro/models'

export function useActiveApps() {
  // TODO use the user activeSpace
  const activeSpace = useObserveOne(SpaceModel, {})
  return useObserveMany(AppModel, activeSpace && { where: { spaceId: activeSpace.id } })
}
