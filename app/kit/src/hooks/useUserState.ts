import { useModel } from '@o/bridge'
import { UserModel } from '@o/models'
import { isDefined, selectDefined } from '@o/utils'
import { useEffect } from 'react'

import { useScopedStateId } from '../views/ScopedState'
import { ScopedAppState, useImmutableUpdateFn } from './useAppState'

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
  const updateFn = useImmutableUpdateFn(state, update, uid, 'appState')

  // scopes user down
  return [selectDefined(state && state.appState[uid], defaultState), updateFn]
}

export function useEnsureDefaultUserState<A>(uid: string, ensure: A) {
  const [user, update] = useModel(UserModel)
  useEffect(() => {
    if (!user) return
    if (isDefined(user.appState[uid])) return
    // ensure default
    update(next => {
      console.log('user default state, set', ensure)
      next.appState[uid] = ensure
    })
  }, [user, uid])
}
