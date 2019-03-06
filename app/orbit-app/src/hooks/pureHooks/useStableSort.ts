import { isEqual } from '@mcro/fast-compare'
import { useRef } from 'react'

export function useStableSort<A extends string>(ids: A[]): A[] {
  const stableKeys = useRef<A[]>([])
  const sortedIds = [...ids].sort()
  if (!isEqual(stableKeys.current.sort(), sortedIds)) {
    // we are building this up over time, so once we see an id
    // we always show it in the same order in the DOM
    const next = [...new Set([...stableKeys.current, ...sortedIds])]
    stableKeys.current = next
  }
  return stableKeys.current
}
