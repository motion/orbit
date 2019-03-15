import { EffectCallback, RefObject, useEffect, useRef } from 'react'

export function useMutationObserver<T extends RefObject<HTMLElement>>(
  ref: T,
  attributes: MutationObserverInit,
  onChange: ((node: T['current']) => any),
): Function {
  const node = ref.current
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(
    () => {
      if (!node) return
      let mutationObserver = new MutationObserver(() => {
        onChange(node)
      })
      mutationObserver.observe(node, attributes)
      dispose.current = () => {
        mutationObserver.disconnect()
      }
      return dispose.current
    },
    [node, attributes],
  )

  return () => dispose.current && dispose.current()
}
