import { useMutationObserver, useResizeObserver, useThrottleFn } from '@o/ui'
import { RefObject, useLayoutEffect, useRef, useState } from 'react'

export type UseTextFitProps = {
  ref?: RefObject<HTMLElement>
  min?: number
  max?: number
  throttle?: number
}

export function useTextFit({ ref, min = 6, throttle = 16, max = 100 }: UseTextFitProps) {
  const parentRef = useRef(null)
  const [scale, setScale] = useState(1)

  const measure = useThrottleFn(
    () => {
      if (!ref.current) return
      const node = ref.current.parentElement
      const parentScale = ref.current.parentElement.clientWidth / ref.current.clientWidth
      const fontSize = Math.min(max, Math.max(min, node.offsetWidth * 0.05))
      setScale(Math.max(1, (fontSize / 50) * parentScale))
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

  return scale
}
