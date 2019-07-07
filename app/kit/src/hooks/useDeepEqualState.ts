import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { isEqual } from "@o/fast-compare";

export function useDeepEqualState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState)
  const setStateIfChanged = useCallback(next => {
    setState(prev => {
      const nextVal = typeof next === 'function' ? next(prev) : next
      if (!isEqual(prev, nextVal)) {
        return nextVal
      }
      return prev
    })
  }, [])
  return [state, setStateIfChanged]
}
