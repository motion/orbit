import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { selectDefined } from '@o/utils'
import { useCallback } from 'react'

import { useScopedStateId } from '../views/ScopedState'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type ScopedAppState<A> = [A, ImmutableUpdateFn<A>]

const idFn = _ => _

export function useAppState<A>(id: string | false, defaultState?: A): ScopedAppState<A> {
  const scopedId = useScopedStateId()
  const identifier = `${scopedId}${id}`

  // ensure defaults
  useEnsureDefaultAppState<A>(identifier, defaultState)

  const [state, update] = useModel(StateModel, {
    where: {
      type: 'app',
      identifier,
    },
  })
  const updateFn = useImmutableUpdateFn(state, update, identifier, 'data')

  if (!identifier) {
    return [null, idFn]
  }

  // scopes state down
  return [selectDefined(state && state.data[identifier], defaultState), updateFn]
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
          const next = val(draft[subKey][uid])
          if (typeof next !== 'undefined') {
            draft[subKey][uid] = next
          }
        } else {
          draft[subKey][uid] = val
        }
      })
    },
    [uid, subKey],
  )
}
