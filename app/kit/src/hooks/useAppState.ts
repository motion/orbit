import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { selectDefined } from '@o/utils'
import { useCallback } from 'react'

import { useScopedStateId } from '../views/ScopedState'
import { useEnsureDefaultState } from './useUserState'

export type ScopedAppState<A> = [A, ImmutableUpdateFn<A>]

const idFn = _ => _

export function useAppState<A>(id: string | false, defaultState?: A): ScopedAppState<A> {
  const scopedId = useScopedStateId()
  const identifier = `${scopedId}${id}`

  // ensure defaults
  useEnsureDefaultState(identifier, 'app', defaultState)

  const [state, update] = useModel(StateModel, {
    where: {
      type: 'app',
      identifier,
    },
  })
  const updateFn = useImmutableUpdateFn(state, update, 'data')

  if (!identifier) {
    return [null, idFn]
  }

  console.log('got', state)
  // scopes state down
  return [selectDefined(state && state.data, defaultState), updateFn]
}

export function useImmutableUpdateFn(state: any, update: ImmutableUpdateFn<any>, subKey: string) {
  return useCallback(
    val => {
      if (!state || !subKey) {
        console.error('State not loaded / not found yet, or no uid!')
        return
      }
      update(draft => {
        if (typeof val === 'function') {
          const next = val(draft[subKey])
          if (typeof next !== 'undefined') {
            draft[subKey] = next
          }
        } else {
          draft[subKey] = val
        }
      })
    },
    [subKey],
  )
}
