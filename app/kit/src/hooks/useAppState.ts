import { ScopedState } from '@o/utils'

import { PersistedStateOptions, usePersistedScopedState } from './useUserState'

export function useAppState<A>(
  id: string | false,
  defaultState: A,
  options?: PersistedStateOptions,
): ScopedState<A> {
  return usePersistedScopedState('app', id, defaultState, options)
}
