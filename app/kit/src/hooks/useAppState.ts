import { useAppBit } from './useAppBit'
import { useEnsureDefaultAppState } from './useEnsureDefaultAppState'

export type UpdateState<A> = (next: Partial<A>) => void
export type ScopedAppState<A, B = UpdateState<A>> = [A, B]

const idFn = _ => _

export function useAppState<A>(uid: string | false, defaultState?: A): ScopedAppState<A> {
  useEnsureDefaultAppState<A>(uid, defaultState)
  const [state, update] = useAppBit()

  if (!uid) {
    return [null, idFn]
  }

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
