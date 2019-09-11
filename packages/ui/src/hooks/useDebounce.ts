import { debounce, DebounceSettings } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useDebounce<A extends (...args: any) => any>(
  fn: A,
  wait: number,
  options: DebounceSettings = { leading: true },
  mountArgs: any[] = [],
): A {
  return useMemo(() => {
    return debounce(fn, wait, options)
  }, [options, ...mountArgs])
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
