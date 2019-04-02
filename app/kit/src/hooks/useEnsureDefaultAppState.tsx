import { useEffect } from 'react'
import { useApp } from './useApp'

export function useEnsureDefaultAppState<A>(uid: string, ensure: A) {
  const [state, update] = useApp()
  useEffect(
    () => {
      if (!state) return
      if (state.data[uid]) return
      // ensure default
      state.data[uid] = ensure
      console.log('updating app default state', ensure, uid, update)
      update(state)
    },
    [state, uid],
  )
}
