import { useMutationObserver, useResizeObserver, useThrottleFn } from '@o/ui'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export type UseTextFitProps = {
  min?: number
  max?: number
  throttle?: number
  updateKey?: any
}

export function useTextFit({ min = 8, throttle = 32, max = 100, updateKey }: UseTextFitProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const parentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const setScaleBounded = useCallback(x => setScale(Math.max(x, Math.min(max, x))), [min, max])
  const throttleSetScale = useThrottleFn(setScaleBounded, { amount: throttle })
  const measure = () => updateScale(scale, ref.current, throttleSetScale)

  useResizeObserver({
    ref: parentRef,
    onChange: measure,
  })

  useResizeObserver({
    ref,
    onChange: measure,
  })

  useMutationObserver({
    ref: ref,
    onChange: measure,
    options: {
      subtree: true,
      attributes: true,
    },
  })

  useLayoutEffect(() => {
    if (ref.current) {
      parentRef.current = ref.current.parentElement
      measure()
    }
  }, [ref, updateKey])

  return {
    ref,
    transform: { scale },
    height: ref.current
      ? +getComputedStyle(ref.current).fontSize.replace('px', '') * scale
      : 'auto',
    width: 'max-content',
  }
}

const updateScale = (last: number, node: HTMLElement, update: Function) => {
  if (!node) return
  const parent = node.parentElement
  const pWidth = parent.clientWidth
  const width = node.clientWidth
  const parentScale = pWidth / width
  if (parentScale !== last) {
    update(parentScale)
  }
}
