import { useModel } from '@o/bridge'
import { SpaceModel, UserModel } from '@o/models'
import { useMemo } from 'react'

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
  const [space] = useActiveSpace()
  return useMemo(() => (space && space.paneSort) || [], (space && space.paneSort) || [])
}
