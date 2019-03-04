import { useCallback, useRef } from 'react'

export function useMemoGetValue<A extends any>(currentValue: A): () => A {
  const curRef = useRef(null)
  curRef.current = currentValue
  return useCallback(() => curRef.current, [])
}
