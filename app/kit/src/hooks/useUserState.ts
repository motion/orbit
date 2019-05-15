import { useModel } from '@o/bridge'
import { UserModel } from '@o/models'
import { selectDefined } from '@o/utils'
import { useCallback, useEffect } from 'react'

import { useScopedStateId } from '../views/ScopedState'
import { ScopedAppState } from './useAppState'

// for storage of UI state that is per-user and not per-workspace
// if you want to store data that is shared between everyone, use useScopedAppState
// if you want to store data just for the individual user,
//   (like positional state, where they are in the UI), use this

export type ScopedUserState<A> = ScopedAppState<A>

export function useUserState<A>(id: string, defaultState?: A): ScopedUserState<A> {
  // scope state id
  const scopedId = useScopedStateId()
  const uid = `${scopedId}${id}`

  // ensure default state
  useEnsureDefaultUserState<A>(uid, defaultState)

  // state
  const [state, update] = useModel(UserModel)

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
  return [selectDefined(state && state.appState[uid], defaultState), updateFn]
}

export function useEnsureDefaultUserState<A>(uid: string, ensure: A) {
  const [user, update] = useModel(UserModel)

  useEffect(() => {
    if (!user) return
    if (user.appState[uid]) return

    // ensure default
    update(next => {
      next.appState[uid] = ensure
    })
  }, [user, uid])
}
