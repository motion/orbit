import { useAppBit } from './useAppBit'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type ScopedAppState<A> = [A, (next: Partial<A>) => void]

export function useAppState<A>(uid: string, defaultState?: A): ScopedAppState<A> {
  useEnsureDefaultAppState<A>(uid, defaultState)
  const [state, update] = useAppBit()
  // scopes state down
  return [
    (state && state.data[uid]) || defaultState,
    next => {
      if (!state) throw new Error('State not loaded / not found yet!')
      state.data[uid] = next
      update(state)
    },
  ]
}
