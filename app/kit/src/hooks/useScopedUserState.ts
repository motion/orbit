import { useModel } from '@o/bridge'
import { UserModel } from '@o/models'
import { useEffect } from 'react'

// for storage of UI state that is per-user and not per-workspace
// if you want to store data that is shared between everyone, use useScopedAppState
// if you want to store data just for the individual user,
//   (like positional state, where they are in the UI), use this

export type ScopedUserState<A> = [A, (next: Partial<A>) => void]

export function useScopedUserState<A>(subSelect: string, defaultState?: A): ScopedUserState<A> {
  useEnsureDefaultUserState<A>(subSelect, defaultState)

  const [user, update] = useModel(UserModel, {})

  // scopes user down
  return [
    user ? user.appState[subSelect] : defaultState,
    next => {
      if (!user) throw new Error('State not loaded / not found yet!')
      user.appState[subSelect] = next
      update(user)
    },
  ]
}

export function useEnsureDefaultUserState<A>(subSelect: string, ensure: A) {
  const [user, update] = useModel(UserModel, {})

  useEffect(
    () => {
      if (!user) return
      if (user.appState[subSelect]) return
      // ensure default
      user.appState[subSelect] = ensure
      update(user)
    },
    [user, subSelect],
  )
}
