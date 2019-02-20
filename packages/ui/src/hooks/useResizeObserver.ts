import { EffectCallback, useEffect, useRef } from 'react'

export function useResizeObserver<T extends React.RefObject<HTMLDivElement>>(
  ref: T,
  onChange: ((node: T['current']) => any),
): Function {
  const node = ref.current
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(
    () => {
      if (!node) return

      // @ts-ignore
      let resizeObserver = new ResizeObserver(() => {
        onChange(node)
      })
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
