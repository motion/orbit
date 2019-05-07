import { ImmutableUpdateFn } from '@o/bridge'
import { useCallback } from 'react'

import { useAppBit } from './useAppBit'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type ScopedAppState<A> = [A, ImmutableUpdateFn<A>]

const idFn = _ => _

export function useAppState<A>(uid: string | false, defaultState?: A): ScopedAppState<A> {
  useEnsureDefaultAppState<A>(uid, defaultState)
  const [state, update] = useAppBit()
  const updateFn = useCallback(cb => {
    if (!state || !uid) {
      console.error('State not loaded / not found yet, or no uid!')
      return
    }
    update(draft => {
      cb(draft.data[uid])
    })
  }, [])

  if (!uid) {
    return [null, idFn]
  }

  // scopes state down
  return [(state && state.data[uid]) || defaultState, updateFn]
}
