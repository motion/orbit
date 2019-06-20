import { ScopedState, usePersistedScopedState } from './useUserState'

export function useAppState<A>(id: string | false, defaultState: A): ScopedState<A> {
  return usePersistedScopedState('app', id, defaultState)
}
