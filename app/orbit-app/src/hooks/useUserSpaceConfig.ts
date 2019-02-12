import { loadOne, save } from '../mediator'
import { Space, SpaceModel, User, UserModel } from '@mcro/models'
import immer from 'immer'
import { useEffect } from 'react'
import { useActiveSpace } from './useActiveSpace'
import { useActiveUser } from './useActiveUser'

type SpaceConfig = User['spaceConfig'][any]

const DEFAULT_SPACE_CONFIG: SpaceConfig = { activePaneIndex: 0 }

// TODO UMED this is a little bit of a mess
// im ok with you redoing some of this with the useModel stuff

export function useUserSpaceConfig(): [SpaceConfig, (next: Partial<SpaceConfig>) => any] {
  const [activeUser] = useActiveUser()
  const [activeSpace] = useActiveSpace()

  useEnsureUserSpaceConfig(activeUser, activeSpace)

  const spaceConfig = (activeUser && activeSpace && activeUser.spaceConfig[activeSpace.id]) || null

  const updateSpaceConfig = async next => {
    const user = await loadOne(UserModel, { args: {} }) // TODO loadOne should allow empty args
    const space = await loadOne(SpaceModel, { args: { where: { id: user.activeSpace } } })
    save(UserModel, immer(activeUser, user => {
      const cur = user.spaceConfig[space.id]
      user.spaceConfig[space.id] = {
        ...cur,
        ...next,
      }
      // TODO why types
    }) as any)
  }

  return [spaceConfig, updateSpaceConfig]
}

function useEnsureUserSpaceConfig(user: User, space: Space) {
  useEffect(
    () => {
      if (user && space) {
        if (!user.spaceConfig[space.id]) {
          save(UserModel, immer(user, user => {
            user.spaceConfig[space.id] = DEFAULT_SPACE_CONFIG
            // TODO why types
          }) as any)
        }
      }
    },
    [user && user.id, space && space.id],
  )
}
