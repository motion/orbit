import { ImmutableUpdateFn } from '@o/bridge'
import { selectDefined } from '@o/utils'
import { useCallback } from 'react'

import { useScopedStateId } from '../views/ScopedState'
import { useAppBit } from './useAppBit'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type ScopedAppState<A> = [A, ImmutableUpdateFn<A>]

const idFn = _ => _

export function useAppState<A>(id: string | false, defaultState?: A): ScopedAppState<A> {
  const scopedId = useScopedStateId()
  const uid = `${scopedId}${id}`

  // ensure defaults
  useEnsureDefaultAppState<A>(uid, defaultState)

  const [state, update] = useAppBit()
  const updateFn = useImmutableUpdateFn(state, update, uid, 'data')

  if (!uid) {
    return [null, idFn]
  }

  // scopes state down
  return [selectDefined(state && state.data[uid], defaultState), updateFn]
}

export function useImmutableUpdateFn(
  state: any,
  update: ImmutableUpdateFn<any>,
  uid: string,
  subKey: string,
) {
  return useCallback(
    val => {
      if (!state || !uid) {
        console.error('State not loaded / not found yet, or no uid!')
        return
      }
      update(draft => {
        if (typeof val === 'function') {
          val(draft[subKey][uid])
        } else {
          draft[subKey][uid] = val
          debugger
        }
      })
    },
    [uid, subKey],
  )
}
