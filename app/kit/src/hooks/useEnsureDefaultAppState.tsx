import { isEqual } from '@o/fast-compare'
import { useEffect } from 'react'

import { useAppBit } from './useAppBit'

export function useEnsureDefaultAppState<A>(uid: string | false, ensure: A) {
  const [state, update] = useAppBit()
  useEffect(() => {
    if (!uid) return
    if (!state) return
    if (state.data[uid]) return
    if (typeof ensure === 'undefined') return
    if (isEqual(state.data[uid], ensure)) return
    update(next => {
      // ensure default
      next.data[uid] = ensure
    })
  }, [state, uid])
}
