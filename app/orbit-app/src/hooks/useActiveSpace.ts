import { useModel, useObserveOne } from '@mcro/model-bridge'
import { SpaceModel, UserModel } from '@mcro/models'

export function useActiveSpace() {
  const user = useObserveOne(UserModel, {})
  const args = user ? { where: { id: user.activeSpace } } : false
  return useModel(SpaceModel, args, {
    observe: true,
  })
}
