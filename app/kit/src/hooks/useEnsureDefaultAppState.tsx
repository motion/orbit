import { useEffect } from 'react'
import { useApp } from './useApp'

export function useEnsureDefaultAppState<A>(subSelect: string, ensure: A) {
  const [state, update] = useApp()
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
