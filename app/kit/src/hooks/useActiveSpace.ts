import { useModel } from '@o/bridge'
import { Space, SpaceModel } from '@o/models'
import { useMemo } from 'react'
import { FindOptions } from 'typeorm'

import { useActiveUser } from './useActiveUser'

export function useActiveSpace(query?: FindOptions<Space>) {
  const [user] = useActiveUser({
    select: ['activeSpace'],
  })
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
  console.log('active space is', space, space.paneSort)
  return useMemo(() => (space && space.paneSort) || [], [
    JSON.stringify((space && space.paneSort) || []),
  ])
}
