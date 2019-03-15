import { EffectCallback, useEffect, useRef } from 'react'
import { ResizeObserver, ResizeObserverCallback } from '../ResizeObserver'

export function useResizeObserver<T extends React.RefObject<HTMLElement>>(
  node: T,
  onResize: ResizeObserverCallback,
): Function {
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(
    () => {
      if (!node || !node.current) return

      let resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(node.current)

      dispose.current = () => {
        resizeObserver.disconnect()
      }

      return dispose.current
    },
    [node],
  )

  return () => dispose.current && dispose.current()
}
