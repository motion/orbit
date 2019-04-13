import { useMutationObserver, useResizeObserver, useThrottleFn } from '@o/ui'
import { RefObject, useLayoutEffect, useRef, useState } from 'react'

export type UseTextFitProps = {
  ref?: RefObject<HTMLElement>
  min?: number
  max?: number
  throttle?: number
}

export function useTextFit({ ref, min = 6, throttle = 100, max = 100 }: UseTextFitProps) {
  const parentRef = useRef(null)
  const [state, setState] = useState({
    fontSize: 16,
    transform: `scale(1)`,
  })

  const measure = useThrottleFn(
    () => {
      if (!ref.current) return
      const node = ref.current.parentElement
      const parentScale = ref.current.parentElement.clientWidth / ref.current.clientWidth
      const fontSize = Math.min(max, Math.max(min, node.offsetWidth * 0.05))
      const scale = (fontSize / 50) * parentScale
      setState({ fontSize: 16, transform: `scale(${scale})` })
    },
    { amount: throttle },
    [ref],
  )

  useResizeObserver({
    ref: parentRef,
    onChange: measure,
  })

  useMutationObserver({
    ref: parentRef,
    onChange: measure,
    options: {
      subtree: true,
      attributes: true,
    },
  })

  useLayoutEffect(() => {
    parentRef.current = ref.current.parentElement
  }, [ref.current])

  useLayoutEffect(() => {
    measure()
  }, [ref])

  return {
    ...state,
    width: 'max-content',
  }
}
