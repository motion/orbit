import { loadOne, save } from '@mcro/model-bridge'
import { Space, SpaceModel, User, UserModel } from '@mcro/models'
import immer from 'immer'
import { useEffect } from 'react'
import { useActiveSpace } from './useActiveSpace'
import { useActiveUser } from './useActiveUser'

type SpaceConfig = User['spaceConfig'][any]

const DEFAULT_SPACE_CONFIG: SpaceConfig = { activePaneIndex: 0 }

export function useUserSpaceConfig(): [SpaceConfig, (next: Partial<SpaceConfig>) => any] {
  // TODO make useActive user have an update function as well...
  const activeUser = useActiveUser()
  const [activeSpace] = useActiveSpace()

  useEnsureUserSpaceConfig(activeUser, activeSpace)

  const spaceConfig =
    (activeUser && activeSpace && activeUser.spaceConfig[activeSpace.id]) || DEFAULT_SPACE_CONFIG

  const updateSpaceConfig = async next => {
    const user = await loadOne(UserModel, { args: {} }) // TODO loadOne should allow empty args
    const space = await loadOne(SpaceModel, { args: { where: { id: user.activeSpace } } })
    save(
      UserModel,
      immer(activeUser, user => {
        const cur = user.spaceConfig[space.id]
        user.spaceConfig[space.id] = {
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
