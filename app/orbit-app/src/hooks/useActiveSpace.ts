import { useModel } from '../useModel'
import { SpaceModel, UserModel } from '@mcro/models'

export function useActiveSpace() {
  const [user] = useModel(UserModel, {})
  const args = user && { where: { id: user.activeSpace } }
  return useModel(SpaceModel, args)
}
