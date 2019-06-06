import { useMutationObserver, useResizeObserver, useThrottledFn } from '@o/ui'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

export type UseTextFitProps = {
  min?: number
  max?: number
  throttle?: number
  updateKey?: any
  extraScale?: number
}

export function useTextFit({
  min = 8,
  throttle = 32,
  max = 200,
  extraScale = 1,
  updateKey,
}: UseTextFitProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const node = ref.current
  const parentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const height = useMemo(() => (node && node.getBoundingClientRect().height) || min, [node])
  const setScaleBounded = useCallback(
    x => {
      const nh = x * height
      const nhc = Math.max(min, Math.min(max, nh))
      const adj = nhc / nh
      setScale(x * adj)
    },
    [min, max, height],
  )
  const setScaleSlow = useThrottledFn(setScaleBounded, { amount: throttle })
  const measure = () => updateScale(scale, ref.current, setScaleSlow)

  useResizeObserver(
    {
      ref: parentRef,
      onChange: measure,
    },
    [parentRef.current],
  )

  useResizeObserver(
    {
      ref,
      onChange: measure,
    },
    [parentRef.current],
  )

  useMutationObserver(
    {
      ref,
      onChange: measure,
      options: {
        subtree: true,
        attributes: true,
      },
    },
    [ref.current],
  )

  useLayoutEffect(() => {
    if (ref.current) {
      parentRef.current = ref.current.parentElement
      measure()
    }
  }, [ref, updateKey])

  return {
    ref,
    isMeasured: !!ref.current,
    height: scale * height,
    style: {
      transform: `scale(${scale * extraScale})`,
      height: ref.current ? `${scale * height}px` : 'auto',
      width: 'max-content',
    },
  }
}

const updateScale = (last: number, node: HTMLElement, update: Function) => {
  if (!node) return
  const parent = node.parentElement
  const pWidth = parent.clientWidth
  const width = node.clientWidth
  // scale down or up
  const parentScale = pWidth / Math.max(width, 1)
  if (parentScale !== last) {
    update(parentScale)
  }
}
