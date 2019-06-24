import { useModel } from '@o/bridge'
import { SpaceModel, UserModel } from '@o/models'

export function useActiveSpace(query?) {
  const [user] = useModel(UserModel)
  return useModel(
    SpaceModel,
    user && {
      where: { id: user.activeSpace },
      ...query,
    },
  )
}

// if you want sorting too
export function useActivePaneSort() {
  const [user] = useModel(UserModel)
  const [space] = useModel(
    SpaceModel,
    user && {
      where: { id: user.activeSpace },
    },
  )
  return space.paneSort
}
