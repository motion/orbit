import { useModel } from '@mcro/bridge'
import { SpaceModel, UserModel } from '@mcro/models'

export function useActiveSpace() {
  const [user] = useModel(UserModel, {})
  const args = user && { where: { id: user.activeSpace } }
  return useModel(SpaceModel, args)
}
