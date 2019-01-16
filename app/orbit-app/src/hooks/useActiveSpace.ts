import { useModel, useObserveOne } from '@mcro/model-bridge'
import { SpaceModel, UserModel } from '@mcro/models'

export function useActiveSpace() {
  const user = useObserveOne(UserModel, {})
  return useModel(SpaceModel, { where: { id: user ? user.id : -1 } })
}
