import { useEffect } from 'react'
import { useAppState } from './useAppState'

export function useEnsureDefaultAppState<A>(subSelect: string, ensure: A) {
  const [state, update] = useAppState()
  useEffect(
    () => {
      if (!state) return
      if (state.data[subSelect]) return

      // ensure default
      state.data[subSelect] = ensure
      console.log('updating app default state', ensure, subSelect, update)
      update(state)
    },
    [state, subSelect],
  )
}
