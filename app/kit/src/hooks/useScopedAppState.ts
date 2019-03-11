import { useAppState } from './useAppState'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type ScopedAppState<A> = [A, (next: Partial<A>) => void]

export function useScopedAppState<A>(subSelect: string, defaultState?: A): ScopedAppState<A> {
  useEnsureDefaultAppState<A>(subSelect, defaultState)

  const [state, update] = useAppState()
  // scopes state down
  return [
    state ? state.data[subSelect] : defaultState,
    next => {
      if (!state) throw new Error('State not loaded / not found yet!')
      state.data[subSelect] = next
      update(state)
    },
  ]
}
