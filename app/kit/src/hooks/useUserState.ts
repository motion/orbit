import { useModel } from '@o/bridge'
import { StateModel } from '@o/models'
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
  const identifier = `${scopedId}${id}`

  // ensure default state
  useEnsureDefaultUserState<A>(identifier, defaultState)

  // state
  const [state, update] = useModel(StateModel, {
    where: {
      type: 'user',
      identifier,
    },
  })
  const updateFn = useImmutableUpdateFn(state, update, identifier, 'data')

  // scopes user down
  return [selectDefined(state && state.data, defaultState), updateFn]
}

export function useEnsureDefaultUserState<A>(identifier: string, ensure: A) {
  const [user, update] = useModel(StateModel, {
    where: {
      type: 'user',
      identifier,
    },
  })
  useEffect(() => {
    if (!user) return
    if (isDefined(user.data)) return
    // ensure default
    update(next => {
      console.log('user default state, set', ensure)
      next.data = ensure
    })
  }, [user])
}
