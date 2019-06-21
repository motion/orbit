import { ImmutableUpdateFn, loadOne, save, useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { useScopedStateId } from '@o/ui'
import { isDefined, OR_TIMED_OUT, orTimeout, selectDefined } from '@o/utils'
import { useCallback } from 'react'

// for storage of UI state that is per-user and not per-workspace
// if you want to store data that is shared between everyone, use useScopedAppState
// if you want to store data just for the individual user,
//   (like positional state, where they are in the UI), use this

export type ScopedState<A> = [A, ImmutableUpdateFn<A>]

export function useUserState<A>(id: string | false, defaultState: A): ScopedState<A> {
  return usePersistedScopedState('user', id, defaultState)
}

export function usePersistedScopedState<A>(
  type: string,
  id: string | false,
  defaultState?: A,
): ScopedState<A> {
  // scope state id
  const scopedId = useScopedStateId()
  const identifier = `${scopedId}${id}`

  // ensure default state
  useEnsureDefaultState<A>(identifier, type, defaultState)

  // state
  const [state, update] = useModel(StateModel, {
    where: {
      type,
      identifier,
    },
  })

  console.log('state', state)

  // scope it to .data
  return [selectDefined(state.data.dataValue, defaultState), useImmutableUpdateFn(update)]
}

const cache = {}

// has to be suspense style
function useEnsureDefaultState<A>(identifier: string, type: string, value: A) {
  const key = `${identifier}${type}`

  if (cache[key]) {
    if (cache[key].resolved) {
      return
    }
    throw cache[key].read
  }

  if (!isDefined(value)) {
    throw new Error(`Must define a default value that isn't undefined for ${identifier} ${type}`)
  }

  cache[key] = {
    resolved: false,
    read: new Promise(res => {
      const finish = () => {
        cache[key].resolved = true
        res()
      }

      const load = orTimeout(
        loadOne(StateModel, {
          args: {
            where: {
              type,
              identifier,
            },
          },
        }),
        1000,
      )

      const create = () => {
        return save(StateModel, {
          type,
          identifier,
          data: { dataValue: value },
        })
      }

      load
        .then(row => {
          if (!row || !isDefined(row.data)) {
            return create()
          }
        })
        .catch(err => {
          if (err === OR_TIMED_OUT) {
            console.error('timed out loading query', identifier, type, value)
            return create()
          } else {
            console.error(err)
          }
        })
        .finally(finish)
    }),
  }
}

function useImmutableUpdateFn(update: ImmutableUpdateFn<any>) {
  return useCallback(val => {
    update(draft => {
      const innerState = draft.data.dataValue
      if (typeof val === 'function') {
        const next = val(innerState)
        if (typeof next !== 'undefined') {
          draft.data.dataValue = next
        }
      } else {
        draft.data.dataValue = val
      }
    })
  }, [])
}
