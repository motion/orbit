import { loadOne, save, useModel } from '@o/bridge'
import { StateModel } from '@o/models'
import { isDefined, OR_TIMED_OUT, orTimeout, selectDefined } from '@o/utils'
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
  useEnsureDefaultState<A>(identifier, 'user', defaultState)

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

const cache = {}

// has to be suspense style
export function useEnsureDefaultState<A>(identifier: string, type: string, data: A) {
  console.log('ensuring default state', identifier, type, data)

  const key = `${identifier}${type}`

  if (cache[key]) {
    if (cache[key].resolved) {
      return
    }
    throw cache[key].read
  }

  if (!isDefined(data)) {
    throw new Error(
      `Must defined a default data object that isn't undefined for ${identifier} ${type}`,
    )
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
          data,
        })
      }

      load
        .then(state => {
          console.log('state', state)
          debugger
          if (isDefined(state.data)) {
            finish()
            return
          }
          if (!state) {
            debugger
            return create()
          }
        })
        .catch(err => {
          if (err === OR_TIMED_OUT) {
            console.error('timed out loading query', identifier, type, data)
            return create()
          } else {
            console.error(err)
          }
        })
        .finally(finish)
    }),
  }
}
