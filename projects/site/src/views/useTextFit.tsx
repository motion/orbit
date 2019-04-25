import { useMutationObserver, useResizeObserver, useThrottleFn } from '@o/ui'
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
  max = 100,
  extraScale = 1,
  updateKey,
}: UseTextFitProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const node = ref.current
  const parentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const setScaleBounded = useCallback(x => setScale(Math.max(x, Math.min(max, x))), [min, max])
  const setScaleSlow = useThrottleFn(setScaleBounded, { amount: throttle })
  const measure = () => updateScale(scale, ref.current, setScaleSlow)
  const fontSizeOG = useMemo(() => (node && getComputedStyle(node).fontSize) || 'inherit', [node])
  const height = useMemo(() => (node && node.getBoundingClientRect().height) || min, [node])

  useResizeObserver({
    ref: parentRef,
    onChange: measure,
  })

  useResizeObserver({
    ref,
    onChange: measure,
  })

  useMutationObserver({
    ref,
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
    isMeasured: !!ref.current,
    height: scale * height,
    style: {
      fontSize: ref.current ? fontSizeOG : undefined,
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
  const parentScale = pWidth / width
  if (parentScale !== last) {
    update(parentScale)
  }
}
