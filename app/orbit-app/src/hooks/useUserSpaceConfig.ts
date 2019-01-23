import { save } from '@mcro/model-bridge'
import { Space, User, UserModel } from '@mcro/models'
import immer from 'immer'
import { useEffect } from 'react'
import { useActiveSpace } from './useActiveSpace'
import { useActiveUser } from './useActiveUser'

type SpaceConfig = User['spaceConfig'][any]

const DEFAULT_SPACE_CONFIG: SpaceConfig = { activePaneIndex: 0 }

export function useUserSpaceConfig(): [SpaceConfig, (next: Partial<SpaceConfig>) => any] {
  const activeUser = useActiveUser()
  const [activeSpace] = useActiveSpace()

  useEnsureUserSpaceConfig(activeUser, activeSpace)

  const spaceConfig = (activeUser && activeUser.spaceConfig[activeSpace.id]) || DEFAULT_SPACE_CONFIG

  const updateSpaceConfig = next => {
    save(
      UserModel,
      immer(activeUser, user => {
        const cur = user.spaceConfig[activeSpace.id]
        user.spaceConfig[activeSpace.id] = {
          ...cur,
          ...next,
        }
      }),
    )
  }

  return [spaceConfig, updateSpaceConfig]
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
