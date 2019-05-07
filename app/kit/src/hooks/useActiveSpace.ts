import { useModel } from '@o/bridge'
import { SpaceModel, UserModel } from '@o/models'

export function useActiveSpace(query?) {
  const [user] = useModel(UserModel)
  console.log('user', user)
  return useModel(
    SpaceModel,
    user && {
      where: { id: user.activeSpace },
      select: ['id', 'name', 'colors'],
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
