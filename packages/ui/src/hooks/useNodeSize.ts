import { isEqual } from '@o/fast-compare'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from './useResizeObserver'

export function useNodeSize(props?: { ref?: RefObject<HTMLElement>; disable?: boolean }) {
  const [state, setState] = useState({ width: 0, height: 0 })
  const innerRef = useRef<HTMLElement>(null)
  const propRef = props && props.ref
  const ref = propRef || innerRef
  const disable = props && props.disable

  useResizeObserver({
    ref,
    disable,
    onChange(entries) {
      const { width, height } = entries[0].contentRect
      const next = { width, height }
      if (!isEqual(next, state)) {
        setState(next)
      }
    },
  })

  useEffect(
    () => {
      if (disable) return
      if (ref.current) {
        const next = {
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        }
        if (!isEqual(next, state)) {
          setState(next)
        }
      }
    },
    [disable, ref],
  )

  return {
    ...state,
    ref,
  }
}
