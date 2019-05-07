import { useModel } from '@o/bridge'
import { UserModel } from '@o/models'
import { useCallback, useEffect } from 'react'

// for storage of UI state that is per-user and not per-workspace
// if you want to store data that is shared between everyone, use useScopedAppState
// if you want to store data just for the individual user,
//   (like positional state, where they are in the UI), use this

export type ScopedUserState<A> = [A, (next: Partial<A>) => void]

export function useUserState<A>(uid: string, defaultState?: A): ScopedUserState<A> {
  useEnsureDefaultUserState<A>(uid, defaultState)
  const [state, update] = useModel(UserModel, {})
  const updateFn = useCallback(cb => {
    if (!state || !uid) {
      console.error('State not loaded / not found yet, or no uid!')
      return
    }
    update(draft => {
      cb(draft.appState[uid])
    })
  }, [])

  // scopes user down
  return [state ? state.appState[uid] : defaultState, updateFn]
}

export function useEnsureDefaultUserState<A>(uid: string, ensure: A) {
  const [user, update] = useModel(UserModel, {})

  useEffect(() => {
    if (!user) return
    if (user.appState[uid]) return

    // ensure default
    update(next => {
      next.appState[uid] = ensure
    })
  }, [user, uid])
}
