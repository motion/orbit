import { useEffect } from 'react'

export function useResizeObserver<T extends React.RefObject<HTMLDivElement>>(
  node: T,
  onChange: ((node: T['current']) => any),
) {
  useEffect(
    () => {
      // @ts-ignore
      let resizeObserver = new ResizeObserver(() => {
        onChange(node.current)
      })
      resizeObserver.observe(node.current)

      return () => {
        resizeObserver.disconnect()
      }
    },
    [node.current],
  )
}
