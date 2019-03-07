import { useModel } from '@o/bridge'
import { SpaceModel, UserModel } from '@o/models'

export function useActiveSpace() {
  const [user] = useModel(UserModel, {})
  const args = user && { where: { id: user.activeSpace } }
  return useModel(SpaceModel, args)
}
