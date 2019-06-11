import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { useScopedStateId } from '@o/ui'
import { selectDefined } from '@o/utils'
import { useCallback } from 'react'

import { useEnsureDefaultState } from './useUserState'

export type ScopedAppState<A> = [A, ImmutableUpdateFn<A>]

export function useAppState<A>(id: string | false, defaultState?: A): ScopedAppState<A> {
  const scopedId = useScopedStateId()
  const identifier = `${scopedId}${id}`

  // ensure defaults
  useEnsureDefaultState(identifier, 'app', { data: defaultState })

  const [state, update] = useModel(StateModel, {
    where: {
      type: 'app',
      identifier,
    },
  })

  // scopes state down
  return [
    selectDefined(state && state.data.data, defaultState),
    useImmutableUpdateFn(update, 'data', wrapDataObject),
  ]
}

export const wrapDataObject = (data: any) => ({ data })
const idFn = (_: any) => _

export function useImmutableUpdateFn(
  update: ImmutableUpdateFn<any>,
  subKey: string,
  wrapper: any = idFn,
) {
  return useCallback(
    val => {
      if (!subKey) {
        console.error('State not loaded / not found yet, or no uid!')
        return
      }
      update(draft => {
        if (typeof val === 'function') {
          const next = wrapper(val(draft[subKey]))
          if (typeof next !== 'undefined') {
            draft[subKey] = next
          }
        } else {
          draft[subKey] = wrapper(val)
        }
      })
    },
    [subKey],
  )
}
