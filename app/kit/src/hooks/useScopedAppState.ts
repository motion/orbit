import { useAppState } from './useAppState'

export function useScopedAppState<A>(subSelect: string): [A, (next: Partial<A>) => void] {
  const [state, update] = useAppState()
  // scopes state down
  return [
    state ? state.data[subSelect] : {},
    next => {
      if (!state) throw new Error('State not loaded / not found yet!')
      state.data[subSelect] = next
      update(state)
    },
  ]
}
