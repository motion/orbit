import { EffectCallback, useEffect, useRef } from 'react'
import { ResizeObserver, ResizeObserverCallback } from '../ResizeObserver'

export function useResizeObserver<T extends HTMLElement>(
  node: T | false | null | undefined,
  onResize: ResizeObserverCallback,
): Function {
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(
    () => {
      if (!node) return

      let resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(node)

      dispose.current = () => {
        resizeObserver.disconnect()
      }

      return dispose.current
    },
    [node],
  )

  return () => dispose.current && dispose.current()
}
