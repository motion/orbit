import { save } from '@mcro/model-bridge'
import { Space, User, UserModel } from '@mcro/models'
import immer from 'immer'
import { useEffect } from 'react'
import { useActiveSpace } from './useActiveSpace'
import { useActiveUser } from './useActiveUser'

const DEFAULT_SPACE_CONFIG = { activePaneIndex: 0 }

export function useUserSpaceConfig(): User['spaceConfig'][any] {
  const activeUser = useActiveUser()
  const [activeSpace] = useActiveSpace()

  useEnsureUserSpaceConfig(activeUser, activeSpace)

  return (activeUser && activeUser.spaceConfig[activeSpace.id]) || DEFAULT_SPACE_CONFIG
}

function useEnsureUserSpaceConfig(user: User, space: Space) {
  useEffect(
    () => {
      if (user && space) {
        if (!user.spaceConfig[space.id]) {
          const next = immer(user, user => {
            user.spaceConfig = {
              ...user.spaceConfig,
              [space.id]: DEFAULT_SPACE_CONFIG,
            }
          })
          save(UserModel, next)
        }
      }
    },
    [user && user.id, space && space.id],
  )
}
