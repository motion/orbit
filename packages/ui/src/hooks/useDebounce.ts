import { useCallback, useEffect, useRef, useState } from 'react'

export function useDebounce(fn: Function, amount: number, mountArgs: any[] = []) {
  const tm = useRef(null)

  useEffect(() => {
    clearTimeout(tm.current)
    return () => clearTimeout(tm.current)
  }, [...mountArgs, amount])

  return useCallback(
    (...args) => {
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        return fn(...args)
      }, amount)
    },
    [...mountArgs, amount],
  )
}

/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export function useDebounceValue(val: any, amt = 0) {
  const [state, setState] = useState(val)

  useEffect(() => {
    let tm = setTimeout(() => {
      setState(val)
    }, amt)

    return () => {
      clearTimeout(tm)
    }
  }, [val])

  return state
}
