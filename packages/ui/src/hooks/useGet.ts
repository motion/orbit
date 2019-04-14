import { useCallback, useRef } from 'react'

export function useGet<A extends any>(currentValue: A): () => A {
  const curRef = useRef(null)
  curRef.current = currentValue
  return useCallback(() => curRef.current, [curRef])
}
