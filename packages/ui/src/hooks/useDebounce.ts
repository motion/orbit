import { useCallback, useEffect, useRef } from 'react'

export function useDebounce(fn: Function, amount: number) {
  const tm = useRef(null)

  useEffect(
    () => {
      clearTimeout(tm.current)
      return () => {
        clearTimeout(tm.current)
      }
    },
    [fn, amount],
  )

  return useCallback(
    (...args) => {
      clearTimeout(tm.current)
      tm.current = setTimeout(() => fn(...args), amount)
    },
    [fn, amount],
  )
}
