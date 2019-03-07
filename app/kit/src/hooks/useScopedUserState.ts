import { useModel } from '@o/bridge'
import { UserModel } from '@o/models'

// for storage of UI state that is per-user and not per-workspace
// if you want to store data that is shared between everyone, use useScopedAppState
// if you want to store data just for the individual user,
//   (like positional state, where they are in the UI), use this

export function useScopedUserState<A>(
  subSelect: string,
  defaultState?: A,
): [A, (next: Partial<A>) => void] {
  const [user, update] = useModel(UserModel, {})
  // scopes user down
  return [
    user ? user.appUserState[subSelect] : defaultState,
    next => {
      if (!user) throw new Error('State not loaded / not found yet!')
      user.appUserState[subSelect] = next
      update(user)
    },
  ]
}
