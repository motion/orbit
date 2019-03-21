import { useCallback, useEffect, useRef, useState } from 'react'

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

export function useDebounceValue(val: any, amt = 0) {
  const [state, setState] = useState(val)

  useEffect(
    () => {
      let tm = setTimeout(() => {
        setState(val)
      }, amt)

      return () => {
        clearTimeout(tm)
      }
    },
    [val],
  )

  return state
}
